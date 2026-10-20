// Правила отправки заявки, которые закрепляем тестами:
// 1. Письмо уходит по КАЖДОЙ заявке, а не только при аварии.
// 2. Каналы независимы: падение одного не теряет заявку.
// 3. Ошибка посетителю - только когда не сработал ни один канал.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const PROXY = "https://api.golubev-consulting.ru/lead";
const EMAIL = "https://api.web3forms.com/submit";

const lead = {
  name: "Иван Петров",
  phone: "+7 926 111-22-33",
  email: "ivan@example.com",
  source: "Форма обратной связи - Главная",
};

// Почтовый канал читает ответ через text(), прокси - через json(),
// поэтому заглушка умеет и то и другое.
const jsonResponse = (body: unknown, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as Response;

const okProxy = () => jsonResponse({ ok: true });
const failProxy = () => jsonResponse({ ok: false, error: "сервер недоступен" }, false);
const okEmail = () => jsonResponse({ success: true });
const failEmail = () => jsonResponse({ success: false }, false);

// Модуль читает ключ на верхнем уровне, поэтому для каждого набора условий
// импортируем его заново с нужным окружением.
async function loadWithKey(key?: string) {
  vi.resetModules();
  vi.stubEnv("VITE_WEB3FORMS_KEY", key ?? "");
  return import("@/lib/lead");
}

function urlsOf(mock: { mock: { calls: [string, RequestInit?][] } }) {
  return mock.mock.calls.map((c) => c[0]).sort();
}

describe("отправка заявки", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("при обычной отправке заявка идёт и в Telegram, и письмом", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? okProxy() : okEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(urlsOf(fetchMock)).toEqual([PROXY, EMAIL].sort());
  });

  it("упал прокси, письмо ушло - заявка доставлена, посетитель ошибки не видит", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? Promise.reject(new Error("сеть недоступна")) : okEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).resolves.toBeUndefined();
  });

  it("упала почта, прокси принял - заявка доставлена, посетитель ошибки не видит", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? okProxy() : failEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).resolves.toBeUndefined();
  });

  it("упали оба канала - бросает ошибку, чтобы посетитель увидел её и телефон", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? failProxy() : failEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).rejects.toThrow("сервер недоступен");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("без ключа почты работает только Telegram: упал прокси - ошибка", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => failProxy());
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey(undefined);

    await expect(sendLead(lead)).rejects.toThrow("сервер недоступен");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(PROXY);
  });

  it("с ?forcebackup=1 заявка идёт только письмом - это ручная проверка почты", async () => {
    window.history.replaceState({}, "", "/forma/?forcebackup=1");
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => okEmail());
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(EMAIL);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body["Откуда заявка"]).toContain("проверка почтового канала");
    window.history.replaceState({}, "", "/");
  });

  it("в письмо уходят все поля заявки", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? okProxy() : okEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await sendLead({ ...lead, direction: "Продажи и CRM", message: "Нужен аудит" });

    const emailCall = fetchMock.mock.calls.find((c) => c[0] === EMAIL);
    const body = JSON.parse(String(emailCall?.[1]?.body));
    expect(body.access_key).toBe("test-key");
    expect(body.subject).toContain("Иван Петров");
    expect(body["Имя"]).toBe("Иван Петров");
    expect(body["Телефон"]).toBe("+7 926 111-22-33");
    expect(body["Почта"]).toBe("ivan@example.com");
    expect(body["Направление"]).toBe("Продажи и CRM");
    expect(body["Сообщение"]).toBe("Нужен аудит");
    expect(body["Откуда заявка"]).toBe("Форма обратной связи - Главная");
  });
});
