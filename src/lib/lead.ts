// Отправка заявки с сайта. Два независимых канала, оба на каждую заявку.
//
// Первый - серверный прокси api.golubev-consulting.ru/lead, оттуда заявка
// уходит в Telegram. Напрямую в api.telegram.org из браузера нельзя: у
// посетителей из РФ он заблокирован, запрос не проходит.
//
// Второй - письмо на почту владельца через EmailJS: сервис отправляет письмо
// через Яндекс-SMTP прямо из браузера посетителя. Яндекс → Яндекс = надёжная
// доставка в России без промежуточных серверов.
//
// Каналы ничем не связаны: Telegram и почта идут разными дорогами, и падение
// любой из них заявку не теряет.

const LEAD_ENDPOINT = "https://api.golubev-consulting.ru/lead";
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE as string | undefined;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE as string | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

function backupForced(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("forcebackup") === "1";
  } catch {
    return false;
  }
}

function diagnose(text: string): void {
  if (!backupForced()) return;
  try {
    console.info("[проверка почтового канала]\n" + text);
  } catch {
    /* диагностика не должна ничего ломать */
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

async function sendEmail(data: LeadData): Promise<boolean> {
  if (!EMAILJS_SERVICE || !EMAILJS_TEMPLATE || !EMAILJS_PUBLIC_KEY) {
    diagnose("Почтовый канал выключен: нет настроек EmailJS.");
    return false;
  }
  try {
    const res = await postJson(EMAILJS_ENDPOINT, {
      service_id: EMAILJS_SERVICE,
      template_id: EMAILJS_TEMPLATE,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        direction: data.direction || "",
        message: data.message || "",
        source: data.source || "",
      },
    });
    const text = await res.text().catch(() => "");
    const ok = res.ok && text === "OK";
    diagnose(
      `Ответ EmailJS: HTTP ${res.status}\n` +
        `Принято: ${ok ? "да" : "нет"}\n` +
        `Текст ответа: ${text.slice(0, 500) || "(пусто)"}`
    );
    return ok;
  } catch (e) {
    diagnose(`Запрос к EmailJS не прошёл: ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}

/**
 * Отправляет заявку обоими каналами сразу: в Telegram через сервер и письмом
 * на почту через EmailJS (Яндекс SMTP).
 *
 * Бросает ошибку, только если не сработал НИ ОДИН канал.
 */
export async function sendLead(data: LeadData): Promise<void> {
  if (backupForced()) {
    const delivered = await sendEmail({
      ...data,
      source: `${data.source || ""} (проверка почтового канала)`.trim(),
    });
    if (!delivered) throw new Error("Почтовый канал не принял заявку");
    return;
  }

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
