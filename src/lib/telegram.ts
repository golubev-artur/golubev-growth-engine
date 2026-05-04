const BOT_TOKEN = "8748102371:AAEGXw8APrHMKGOBcDgAP2IBQPvixuDlDwY";
const CHAT_ID = "-5082288324";

export async function sendToTelegram(data: {
  name: string;
  phone: string;
  email?: string;
  direction?: string;
  message?: string;
  source?: string;
}): Promise<void> {
  const lines = [
    "🔔 <b>Новая заявка с сайта</b>",
    "",
    `👤 <b>Имя:</b> ${data.name}`,
    `📞 <b>Телефон:</b> ${data.phone}`,
  ];

  if (data.email) lines.push(`📧 <b>Email:</b> ${data.email}`);
  if (data.direction) lines.push(`📋 <b>Направление:</b> ${data.direction}`);
  if (data.message) lines.push(`💬 <b>Сообщение:</b> ${data.message}`);
  if (data.source) lines.push(``, `🌐 <b>Источник:</b> ${data.source}`);

  const text = lines.join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch {
    // не блокируем UX если TG недоступен
  }
}
