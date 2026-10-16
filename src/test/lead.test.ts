// Проверяем главное правило отправки заявки: заявка считается потерянной
// (и посетителю показывается ошибка) только если не сработал НИ ОДИН канал.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const PROXY = "https://api.golubev-consulting.ru/lead";
const BACKUP = "https://api.web3forms.com/submit";

const lead = {
  name: "Иван Петров",
  phone: "+7 926 111-22-33",
  email: "ivan@example.com",
  source: "Форма обратной связи - Главная",
};

const jsonResponse = (body: unknown, ok = true) =>
  ({ ok, status: ok ? 200 : 500, json: async () => body }) as Response;

// Модуль читает ключ на верхнем уровне, поэтому для каждого набора условий
// импортируем его заново с нужным окружением.
async function loadWithKey(key?: string) {
  vi.resetModules();
  vi.stubEnv("VITE_WEB3FORMS_KEY", key ?? "");
  return import("@/lib/lead");
}

describe("отправка заявки", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("при работающем прокси отправляет только в него, запасной канал не трогает", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(PROXY);
  });

  it("если прокси упал, а запасной канал принял - заявка доставлена, ошибки нет", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === PROXY ? Promise.reject(new Error("сеть недоступна")) : jsonResponse({ success: true })
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(BACKUP);
  });

  it("если упали оба канала - бросает ошибку, чтобы посетитель увидел её и телефон", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === PROXY ? jsonResponse({ ok: false, error: "сервер недоступен" }, false) : jsonResponse({ success: false }, false)
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await expect(sendLead(lead)).rejects.toThrow("сервер недоступен");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("без ключа запасного канала ведёт себя как раньше: упал прокси - ошибка", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: false, error: "сервер недоступен" }, false));
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey(undefined);

    await expect(sendLead(lead)).rejects.toThrow("сервер недоступен");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("в запасной канал уходят все поля заявки и пометка, что канал запасной", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === PROXY ? Promise.reject(new Error("нет связи")) : jsonResponse({ success: true })
    );
    vi.stubGlobal("fetch", fetchMock);
    const { sendLead } = await loadWithKey("test-key");

    await sendLead({ ...lead, direction: "Продажи и CRM", message: "Нужен аудит" });

    const body = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(body.access_key).toBe("test-key");
    expect(body.subject).toContain("Иван Петров");
    expect(body["Телефон"]).toBe("+7 926 111-22-33");
    expect(body["Направление"]).toBe("Продажи и CRM");
    expect(body["Сообщение"]).toBe("Нужен аудит");
    expect(body["Откуда заявка"]).toBe("Форма обратной связи - Главная");
    expect(body["Канал"]).toContain("Запасной");
  });
});
