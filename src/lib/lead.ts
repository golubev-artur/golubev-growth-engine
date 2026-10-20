// Отправка заявки с сайта. Два независимых канала, оба на каждую заявку.
//
// Первый - серверный прокси api.golubev-consulting.ru/lead, оттуда заявка
// уходит в Telegram. Напрямую в api.telegram.org из браузера нельзя: у
// посетителей из РФ он заблокирован, запрос не проходит.
//
// Второй - письмо на почту владельца через внешний сервис Web3Forms, прямо из
// браузера. Владелец хочет видеть каждую заявку в почте, поэтому письмо идёт
// всегда, а не только в аварии.
//
// Каналы ничем не связаны: Telegram и почта идут разными дорогами, и падение
// любой из них заявку не теряет.

const LEAD_ENDPOINT = "https://api.golubev-consulting.ru/lead";
const BACKUP_ENDPOINT = "https://api.web3forms.com/submit";

// Ключ доступа Web3Forms. Подставляется при сборке из секрета репозитория
// WEB3FORMS_KEY (см. шаг Build в .github/workflows/deploy.yml).
//
// В сам код ключ не вписываем: хранение ключей в исходниках - плохая привычка,
// даже когда конкретный ключ публичный по устройству сервиса. Без ключа
// почтовый канал просто выключен, работает только Telegram.
const BACKUP_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

// Проверка почтового канала отдельно от остального: открыть страницу с формой,
// добавив к адресу ?forcebackup=1 - заявка уйдёт только письмом, минуя сервер.
// Нужно, чтобы канал можно было проверить заранее, а не выяснять его
// работоспособность в момент, когда он понадобился.
function backupForced(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("forcebackup") === "1";
  } catch {
    return false;
  }
}

// Режим разбора проблем: ?forcebackup=1 показывает прямо на странице, что
// ответил почтовый сервис. Без этого отладка вслепую: заявка «ушла», письма
// нет, и причина не видна ни владельцу, ни нам.
function diagnose(text: string): void {
  if (!backupForced()) return;
  try {
    const box = document.createElement("pre");
    box.textContent = text;
    box.setAttribute(
      "style",
      [
        "position:fixed",
        "left:12px",
        "right:12px",
        "bottom:12px",
        "z-index:2147483647",
        "max-height:45vh",
        "overflow:auto",
        "margin:0",
        "padding:12px 14px",
        "background:#0c1a2e",
        "color:#e6f0fa",
        "border:1px solid #1e90ff",
        "border-radius:10px",
        "font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace",
        "white-space:pre-wrap",
        "word-break:break-word",
      ].join(";")
    );
    document.body.appendChild(box);
  } catch {
    /* страница могла уже уйти - диагностика не должна ничего ломать */
  }
}

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  direction?: string;
  message?: string;
  source?: string;
}

const TIMEOUT_MS = 8000;

async function postJson(url: string, body: unknown, extraHeaders?: Record<string, string>): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function sendViaProxy(data: LeadData): Promise<void> {
  const res = await postJson(LEAD_ENDPOINT, data);
  const json = await res.json().catch(() => ({}) as { ok?: boolean; error?: string });
  if (!res.ok || !json.ok) {
    throw new Error(json.error || `Ошибка отправки (${res.status})`);
  }
}

// Письмо владельцу через внешний сервис. Текст собираем здесь же, чтобы в
// почте была та же картина, что и в Telegram: кто, телефон, откуда заявка.
async function sendEmail(data: LeadData): Promise<boolean> {
  if (!BACKUP_KEY) {
    diagnose("Почтовый канал выключен: при сборке сайта не было ключа.");
    return false;
  }
  try {
    const res = await postJson(
      BACKUP_ENDPOINT,
      {
        access_key: BACKUP_KEY,
        subject: `Заявка с сайта: ${data.name || "без имени"}${data.phone ? `, ${data.phone}` : ""}`,
        from_name: "Сайт golubev-consulting.ru",
        // Поля уходят в письмо списком, поэтому названия - человеческие.
        Имя: data.name || "",
        Телефон: data.phone || "",
        Почта: data.email || "",
        Направление: data.direction || "",
        Сообщение: data.message || "",
        "Откуда заявка": data.source || "",
      },
      // Без этого заголовка сервис отвечает не JSON, а переадресацией на свою
      // страницу - так указано в его документации.
      { Accept: "application/json" }
    );
    const text = await res.text().catch(() => "");
    let json: { success?: boolean; message?: string } = {};
    try {
      json = JSON.parse(text);
    } catch {
      /* не JSON - покажем как есть в режиме проверки */
    }
    const ok = res.ok && json.success === true;
    diagnose(
      `Ответ почтового сервиса: HTTP ${res.status}\n` +
        `Принято: ${ok ? "да" : "нет"}\n` +
        `Текст ответа: ${text.slice(0, 500) || "(пусто)"}`
    );
    return ok;
  } catch (e) {
    diagnose(`Запрос к почтовому сервису не прошёл: ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}

/**
 * Отправляет заявку обоими каналами сразу: в Telegram через сервер и письмом
 * на почту. Это сделано намеренно - письмо должно приходить по КАЖДОЙ заявке,
 * а не только в аварии, и второе уведомление тут не лишнее, а нужное.
 *
 * Побочный эффект приятный: каналы независимы, поэтому падение любого из них
 * заявку не теряет.
 *
 * Бросает ошибку, только если не сработал НИ ОДИН канал, то есть заявка
 * действительно потеряна и посетителю нужно показать ошибку с телефоном.
 */
export async function sendLead(data: LeadData): Promise<void> {
  // Режим проверки почтового канала: ?forcebackup=1 - шлём только письмо.
  if (backupForced()) {
    const delivered = await sendEmail({
      ...data,
      source: `${data.source || ""} (проверка почтового канала)`.trim(),
    });
    if (!delivered) throw new Error("Почтовый канал не принял заявку");
    return;
  }

  // Параллельно, а не по очереди: посетитель не должен ждать два запроса.
  let proxyError: unknown = null;
  const [, emailDelivered] = await Promise.all([
    sendViaProxy(data).catch((error: unknown) => {
      proxyError = error;
    }),
    sendEmail(data),
  ]);

  if (proxyError && !emailDelivered) {
    throw proxyError instanceof Error ? proxyError : new Error("Заявку не удалось отправить");
  }
}
