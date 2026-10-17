// Отправка заявки с сайта. Два канала, по очереди.
//
// Основной - серверный прокси api.golubev-consulting.ru/lead. Напрямую в
// api.telegram.org из браузера нельзя: у посетителей из РФ он заблокирован,
// запрос не проходит. Прокси пересылает заявку в Telegram и на почту.
//
// Запасной - внешний сервис Web3Forms, который шлёт заявку на почту владельца
// напрямую из браузера. Он нужен ровно на один случай: прокси недоступен.
// Тогда заявка всё равно доходит, а не теряется вместе с клиентом.
//
// Запасной канал включается ТОЛЬКО если основной не сработал, иначе на каждую
// заявку приходило бы по два уведомления.

const LEAD_ENDPOINT = "https://api.golubev-consulting.ru/lead";
const BACKUP_ENDPOINT = "https://api.web3forms.com/submit";

// Ключ доступа Web3Forms. Подставляется при сборке из секрета репозитория
// WEB3FORMS_KEY (см. шаг Build в .github/workflows/deploy.yml).
//
// В сам код ключ не вписываем: хранение ключей в исходниках - плохая привычка,
// даже когда конкретный ключ публичный по устройству сервиса. Без ключа
// запасной канал просто выключен, поведение остаётся прежним.
const BACKUP_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

// Проверка запасного канала без настоящей аварии: открыть страницу с формой,
// добавив к адресу ?forcebackup=1 - заявка уйдёт сразу запасным каналом, минуя
// сервер. Нужно, чтобы канал можно было проверить заранее, а не выяснять его
// работоспособность в момент, когда он понадобился.
function backupForced(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("forcebackup") === "1";
  } catch {
    return false;
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

async function postJson(url: string, body: unknown): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
async function sendViaBackup(data: LeadData): Promise<boolean> {
  if (!BACKUP_KEY) return false;
  try {
    const res = await postJson(BACKUP_ENDPOINT, {
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
      Канал: "Запасной канал: основной сервер не ответил",
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && json.success === true;
  } catch {
    return false;
  }
}

/**
 * Отправляет заявку. Бросает ошибку, только если НИ ОДИН канал не сработал,
 * то есть заявка действительно потеряна и посетителю нужно показать ошибку
 * с телефоном для связи.
 */
export async function sendLead(data: LeadData): Promise<void> {
  if (backupForced()) {
    const delivered = await sendViaBackup({
      ...data,
      source: `${data.source || ""} (проверка запасного канала)`.trim(),
    });
    if (!delivered) throw new Error("Запасной канал не принял заявку");
    return;
  }
  try {
    await sendViaProxy(data);
    return;
  } catch (primaryError) {
    const delivered = await sendViaBackup(data);
    if (!delivered) throw primaryError;
  }
}
