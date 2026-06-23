const CATEGORY_TO_SLUG: Record<string, string> = {
  "Продажи и CRM": "sales-crm",
  "Бизнес-процессы": "business-processes",
  "Маркетинг": "marketing",
  "Управление и стратегия": "management-strategy",
  "Персонал и команда": "hr-team",
  "Технологии и автоматизация": "tech-automation",
  "Автоматизация": "tech-automation",
  "Клиентский сервис": "client-service",
  "Стратегические сессии": "strategic-session",
  "Финансы": "finance",
  "Юридические услуги": "legal",
};

export const getCategoryHref = (category: string): string | null => {
  const slug = CATEGORY_TO_SLUG[category];
  return slug ? `/services/${slug}` : null;
};
