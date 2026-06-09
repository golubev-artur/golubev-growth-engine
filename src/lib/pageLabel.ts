/**
 * Возвращает читаемое название страницы по pathname для поля source в Telegram
 */
export function getPageLabel(pathname: string): string {
  if (pathname === "/") return "Главная";
  if (pathname === "/presentation") return "Страница презентации";
  if (pathname === "/faq") return "Страница FAQ";
  if (pathname === "/press") return "Пресс-центр";
  if (pathname === "/forma") return "Страница записи на онлайн-встречу";
  if (pathname === "/blog") return "Блог";
  if (pathname === "/services") return "Все услуги";
  if (pathname === "/privacy") return "Политика конфиденциальности";
  if (pathname.startsWith("/services/")) {
    const slug = pathname.replace("/services/", "");
    const labels: Record<string, string> = {
      "sales-crm": "Услуга: Продажи и CRM",
      "business-processes": "Услуга: Бизнес-процессы",
      "marketing": "Услуга: Маркетинг",
      "management-strategy": "Услуга: Управление и стратегия",
      "hr-team": "Услуга: HR и персонал",
      "tech-automation": "Услуга: Технологии и автоматизация",
      "client-service": "Услуга: Клиентский сервис",
      "strategic-session": "Услуга: Стратегическая сессия",
      "legal": "Услуга: Юридические вопросы",
      "finance": "Услуга: Финансовые вопросы",
    };
    return labels[slug] ?? `Услуга: ${slug}`;
  }
  if (pathname.startsWith("/blog/")) return `Блог: ${pathname.replace("/blog/", "")}`;
  return pathname;
}
