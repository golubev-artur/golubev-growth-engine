# Golubev Consulting — golubev-consulting.ru

Сайт консалтинга Артура Голубева. Общий контекст (автоматизация, cron, Telegram) — в `~/sites/CLAUDE.md`, он подхватывается автоматически. Здесь только специфика проекта.

- **Репозиторий:** `golubev-artur/golubev-growth-engine` (SSH)
- **Домен:** golubev-consulting.ru (GitHub Pages, `public/CNAME`)
- **Стек:** Vite + React 18 + TS + Tailwind + shadcn/ui, роутинг `react-router-dom`, SEO через `react-helmet-async`

## Команды

```bash
npm run dev       # локальный сервер
npm run build     # vite build + scripts/generate-blog-pages.mjs
npm run test      # vitest
npm run lint
```

`npm run build` обязательно прогоняет `generate-blog-pages.mjs` — он делает статические HTML-страницы для каждого поста (OG-теги, meta) поверх `dist/index.html`. Без него посты теряют превью в соцсетях и хуже индексируются.

## Роуты

`/` · `/services` · `/services/:slug` · `/blog` · `/blog/:slug` · `/faq` · `/press` · `/presentation` · `/forma` · `/privacy` · `/client/:slug` · `/admin`

---

## Блог

**Данные:** `src/data/blog.ts` — один большой массив `blogPosts` (~1 МБ, 100+ постов). Файл большой: читай частями через `offset`/`limit`, а не целиком.

```ts
export interface BlogPost {
  slug: string;      // уникальный, английский kebab-case
  title: string;     // русский, включает ключевой запрос
  excerpt: string;   // 1-2 предложения
  date: string;      // YYYY-MM-DD
  category: string;  // из списка ниже
  readTime: string;  // '8 мин'
  image: string;     // имя переменной из шапки файла
  content: string;   // сама статья
}
```

**Новый пост добавляется ПЕРВЫМ элементом массива** — сразу после `export const blogPosts: BlogPost[] = [`. Сортировки по дате в рантайме нет, порядок в файле = порядок на сайте.

### Категории (только эти)
`Продажи и CRM` · `Управление и стратегия` · `Автоматизация` · `Персонал и команда` · `Клиентский сервис` · `Маркетинг` · `Бизнес-процессы` · `Финансы` · `Юридические услуги` · `Стратегические сессии`

### Картинки
Переменные объявлены в начале `blog.ts`, в поле `image` пишется **имя переменной**, не строка:
`arthurOffice1`, `arthurOffice2`, `arthurOffice4`, `arthurOffice5`, `blogCrm`, `blogOkr`, `blogAutomation`, `blogHr`, `blogNps`, `blogAi`, `serviceStrategy`, `arthurMain`

### Правила текста
- Объём **1000-1300 слов**, заголовки `##`.
- Стиль — Артур Голубев: эксперт-консультант с 12+ годами практики, прямой и практичный тон, конкретные примеры и цифры.
- Ключевой запрос обязан войти в **H1, первый абзац и один из H2**.
- **2-3 внутренние ссылки** — обычным текстом со слешем в скобках, НЕ markdown:
  `«Подробнее в нашем направлении по продажам и CRM (/services/sales-crm)»`
- **Длинное тире (—) запрещено.** Только дефис (-). Есть автозамена в скрипте, но лучше писать сразу правильно.
- Не дублируй темы: сверься со списком существующих `slug` в файле.

### Что обновляется вместе с постом
1. `src/data/blog.ts` — сам пост
2. `public/sitemap.xml` — `<url>` перед `</urlset>`, `priority 0.7`, `changefreq monthly`
3. `public/rss.xml` — перегенерируется скриптом публикации (не руками)
4. IndexNow → Яндекс и Bing (ключ лежит в `public/1d7744ee576da47c8da7fa3bd5bacb55.txt`)

Коммит: `Блог: [название поста]`.

---

## Автопубликация

`~/scripts/publish-blog-post.sh`, cron **пн/ср/пт в 06:00**. Порядок работы:

1. Лок + проверка «сегодня уже был пост?» (по дате коммита в `blog.ts`)
2. `git pull --rebase`
3. Берёт первый неиспользованный запрос из `~/scripts/blog-keywords.txt`; если осталось ≤3 — генерирует 20 новых
4. Запускает `claude --model claude-opus-4-8 -p "..."` с промптом-инструкцией (шаги 1-7)
5. **Проверка успеха:** верхний пост в `blog.ts` должен иметь сегодняшнюю дату. Не совпало или в выводе признак разлогина → откат `git checkout`, алерт в TG, выход
6. Автозамена `—` → `-`
7. Перегенерация RSS → коммит → push с retry
8. IndexNow (Yandex + Bing)
9. `sleep 240`, затем верификация: пуш прошёл · slug есть в RSS · `lastBuildDate` сегодняшняя · slug есть в sitemap
10. Итог в TG: ✅ с ссылкой либо 🚨 со списком проблем

Промпт для генерации поста живёт внутри скрипта (строки ~144-186). **Если нужно поменять правила написания постов — правится он, а не этот файл:** автозапуск явно игнорирует CLAUDE.md.

---

## Telegram

**Лиды идут через серверный прокси, не напрямую.** `src/lib/telegram.ts` шлёт POST на `https://api.golubev-consulting.ru/lead`; сервер (`~/sites/golubev-consulting/client-api/server.js`) пересылает в Telegram.

Причина: `api.telegram.org` заблокирован у посетителей из РФ, прямой `fetch` из браузера не проходит. **Не переписывай на прямой вызов Telegram API** — заявки перестанут доходить. Бонусом токен бота не попадает в бандл.

Формы, использующие `sendToTelegram`: `ContactSection`, `ContactFormModal`, `PresentationGate`, `Booking`.

**Уведомления о постах** — см. `~/sites/CLAUDE.md`. Приходят из двух мест: из скрипта публикации (после верификации) и из job `notify` в `.github/workflows/deploy.yml` (тот парсит diff `blog.ts` на новые `slug:`).

---

## Деплой

`.github/workflows/deploy.yml`, триггер — push в `main`. Джобы: `build` (npm install → npm run build → детект новых постов в diff) → `deploy` (GitHub Pages) → `notify` (TG, только если найдены новые посты).

`fetch-depth: 2` в checkout нужен именно для `git diff HEAD~1 HEAD` в детекте постов — не уменьшай.
