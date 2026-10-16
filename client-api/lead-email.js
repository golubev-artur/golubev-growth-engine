// Дублирование заявок с сайта на почту.
//
// Зачем: сейчас заявка уходит только в Telegram. Если бот или Telegram
// недоступны, заявка не доходит и восстановить её неоткуда. Почта - второй
// независимый канал, плюс файл leads.log на диске как последняя страховка.
//
// Модуль намеренно устроен так, что НЕ МОЖЕТ сломать существующую отправку:
// он ничего не выбрасывает наружу, при любой ошибке возвращает { ok: false }
// и пишет строку в консоль. Если переменные окружения не заданы - просто
// молчит и ничего не делает.
//
// Подключение в server.js - см. client-api/README.md.

const fs = require("fs");
const path = require("path");

const LOG_FILE = process.env.LEAD_LOG_FILE || path.join(__dirname, "leads.log");

const SMTP = {
  host: process.env.SMTP_HOST || "smtp.yandex.ru",
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASSWORD || "",
};
const MAIL_TO = process.env.LEAD_EMAIL_TO || "";

function isConfigured() {
  return Boolean(SMTP.user && SMTP.pass && MAIL_TO);
}

// Московское время: сервер может стоять в UTC, а в письме нужно время,
// по которому человек реально перезванивает.
function moscowTime(date = new Date()) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatLead(lead, date = new Date()) {
  const rows = [
    ["Имя", lead.name],
    ["Телефон", lead.phone],
    ["Почта", lead.email],
    ["Направление", lead.direction],
    ["Сообщение", lead.message],
    ["Откуда заявка", lead.source],
  ].filter(([, value]) => value && String(value).trim());

  const body = rows.map(([label, value]) => `${label}: ${String(value).trim()}`).join("\n");
  return `Новая заявка с сайта golubev-consulting.ru\n\n${body}\n\nВремя (Москва): ${moscowTime(date)}`;
}

// Тема письма должна читаться в списке входящих без открытия.
function subject(lead) {
  const who = (lead.name || "").trim() || "без имени";
  const phone = (lead.phone || "").trim();
  return `Заявка с сайта: ${who}${phone ? `, ${phone}` : ""}`;
}

// Файл-страховка: пишется ВСЕГДА, до всякой отправки. Даже если упадут и
// Telegram, и почта, заявка останется на диске.
function appendLeadLog(lead, date = new Date()) {
  try {
    const line = JSON.stringify({ at: date.toISOString(), ...lead }) + "\n";
    fs.appendFileSync(LOG_FILE, line, "utf8");
    return { ok: true };
  } catch (e) {
    console.error("[lead-email] не удалось записать leads.log:", e.message);
    return { ok: false, error: e.message };
  }
}

async function sendLeadEmail(lead) {
  if (!isConfigured()) {
    console.warn("[lead-email] не настроено (нет SMTP_USER / SMTP_PASSWORD / LEAD_EMAIL_TO) - письмо не отправлено");
    return { ok: false, error: "not_configured" };
  }
  try {
    const nodemailer = require("nodemailer");
    const transport = nodemailer.createTransport({
      host: SMTP.host,
      port: SMTP.port,
      secure: SMTP.secure,
      auth: { user: SMTP.user, pass: SMTP.pass },
    });
    await transport.sendMail({
      from: `"Заявки с сайта" <${SMTP.user}>`,
      to: MAIL_TO,
      // Чтобы на письмо можно было ответить прямо клиенту, если он оставил почту.
      replyTo: lead.email && String(lead.email).includes("@") ? String(lead.email).trim() : undefined,
      subject: subject(lead),
      text: formatLead(lead),
    });
    return { ok: true };
  } catch (e) {
    console.error("[lead-email] письмо не ушло:", e.message);
    return { ok: false, error: e.message };
  }
}

// Главная функция для server.js: пишет в лог и шлёт письмо, никогда не падает.
async function notifyLead(lead) {
  appendLeadLog(lead);
  return sendLeadEmail(lead);
}

module.exports = { notifyLead, sendLeadEmail, appendLeadLog, formatLead, subject, isConfigured };

// Проверка настройки: node lead-email.js --test
// Отправляет тестовое письмо на LEAD_EMAIL_TO и печатает результат.
if (require.main === module && process.argv.includes("--test")) {
  const testLead = {
    name: "Проверка связи",
    phone: "+7 (900) 000-00-00",
    email: "test@example.com",
    direction: "Продажи и CRM",
    message: "Тестовая заявка, отправлена вручную для проверки настройки почты.",
    source: "Проверка настройки (node lead-email.js --test)",
  };
  console.log("--- текст письма ---\n" + formatLead(testLead) + "\n--------------------");
  if (!isConfigured()) {
    console.error("Почта не настроена: задайте SMTP_USER, SMTP_PASSWORD и LEAD_EMAIL_TO. См. README.md");
    process.exit(1);
  }
  sendLeadEmail(testLead).then((r) => {
    console.log(r.ok ? `Письмо отправлено на ${MAIL_TO}. Проверьте входящие и «Спам».` : `Не отправлено: ${r.error}`);
    process.exit(r.ok ? 0 : 1);
  });
}
