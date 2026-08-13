// Заявки шлём через серверный прокси api.golubev-consulting.ru/lead,
// т.к. api.telegram.org заблокирован у посетителей из РФ (прямой fetch
// из браузера не проходит). Сервер пересылает в Telegram надёжно.
const LEAD_ENDPOINT = "https://api.golubev-consulting.ru/lead";

export async function sendToTelegram(data: {
  name: string;
  phone: string;
  email?: string;
  direction?: string;
  message?: string;
  source?: string;
}): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      throw new Error(json.error || `Ошибка отправки (${res.status})`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
