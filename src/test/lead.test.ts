import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const PROXY = "https://api.golubev-consulting.ru/lead";
const EMAILJS = "https://api.emailjs.com/api/v1.0/email/send";

const lead = {
  name: "Иван Петров",
  phone: "+7 926 111-22-33",
  email: "ivan@example.com",
  source: "Форма обратной связи - Главная",
};

const jsonResponse = (body: unknown, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  }) as Response;

const okProxy = () => jsonResponse({ ok: true });
const failProxy = () => jsonResponse({ ok: false, error: "сервер недоступен" }, false);
const okEmail = () => ({ ok: true, status: 200, json: async () => ({}), text: async () => "OK" }) as Response;
const failEmail = () => jsonResponse("error", false);

async function loadWithKeys(keys?: { service?: string; template?: string; publicKey?: string }) {
  vi.resetModules();
  vi.stubEnv("VITE_EMAILJS_SERVICE", keys?.service ?? "");
  vi.stubEnv("VITE_EMAILJS_TEMPLATE", keys?.template ?? "");
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", keys?.publicKey ?? "");
  return import("@/lib/lead");
}

const emailjsKeys = { service: "service_test", template: "template_test", publicKey: "pk_test" };

function urlsOf(mock: { mock: { calls: [string, RequestInit?][] } }) {
  return mock.mock.calls.map((c) => c[0]).sort();
}

describe("отправка заявки", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("при обычной отправке заявка идёт и в Telegram, и письмом", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? okProxy() : okEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(emailjsKeys);
    await expect(sendLead(lead)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(urlsOf(fetchMock)).toEqual([PROXY, EMAILJS].sort());
  });

  it("упал прокси, письмо ушло - посетитель ошибки не видит", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? Promise.reject(new Error("сеть недоступна")) : okEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(emailjsKeys);
    await expect(sendLead(lead)).resolves.toBeUndefined();
  });

  it("упала почта, прокси принял - посетитель ошибки не видит", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? okProxy() : failEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(emailjsKeys);
    await expect(sendLead(lead)).resolves.toBeUndefined();
  });

  it("упали оба канала - бросает ошибку", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? failProxy() : failEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(emailjsKeys);
    await expect(sendLead(lead)).rejects.toThrow("сервер недоступен");
  });

  it("без ключей EmailJS работает только Telegram", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => failProxy());
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(undefined);
    await expect(sendLead(lead)).rejects.toThrow("сервер недоступен");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(PROXY);
  });

  it("?forcebackup=1 - заявка только письмом", async () => {
    window.history.replaceState({}, "", "/forma/?forcebackup=1");
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => okEmail());
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(emailjsKeys);
    await expect(sendLead(lead)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(EMAILJS);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.template_params.source).toContain("проверка почтового канала");
    window.history.replaceState({}, "", "/");
  });

  it("в EmailJS уходят все поля заявки", async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) =>
      url === PROXY ? okProxy() : okEmail()
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKeys(emailjsKeys);
    await sendLead({ ...lead, direction: "Продажи и CRM", message: "Нужен аудит" });
    const emailCall = fetchMock.mock.calls.find((c) => c[0] === EMAILJS);
    const body = JSON.parse(String(emailCall?.[1]?.body));
    expect(body.service_id).toBe("service_test");
    expect(body.template_id).toBe("template_test");
    expect(body.user_id).toBe("pk_test");
    expect(body.template_params.name).toBe("Иван Петров");
    expect(body.template_params.phone).toBe("+7 926 111-22-33");
    expect(body.template_params.email).toBe("ivan@example.com");
    expect(body.template_params.direction).toBe("Продажи и CRM");
    expect(body.template_params.message).toBe("Нужен аудит");
  });
});
