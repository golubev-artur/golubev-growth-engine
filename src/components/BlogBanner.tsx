/**
 * BlogBanner - SVG-баннер для карточек блога.
 * Стиль: тёмный фон, решётка, синий акцент - как в golubev_banner_team_v2.html
 */

interface BlogBannerProps {
  category: string;
  title: string;
  readTime: string;
  date: string;
  /** 0–11 - выбирает цветовой акцент тега */
  index?: number;
}

// Шесть пар акцентных цветов для разнообразия
const ACCENTS = [
  { tag: "#1E90FF", glow: "rgba(30,144,255,0.13)" },
  { tag: "#10b981", glow: "rgba(16,185,129,0.13)" },
  { tag: "#8b5cf6", glow: "rgba(139,92,246,0.13)" },
  { tag: "#f59e0b", glow: "rgba(245,158,11,0.13)" },
  { tag: "#ef4444", glow: "rgba(239,68,68,0.13)" },
  { tag: "#06b6d4", glow: "rgba(6,182,212,0.13)" },
];

// Обрезаем длинные строки для SVG
function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

// Разбиваем заголовок на строки (≤28 символов)
function wrapTitle(title: string, maxWidth = 28): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxWidth) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
    if (lines.length === 3) break;
  }
  if (current && lines.length < 4) lines.push(current.trim());
  return lines.slice(0, 4);
}

const BlogBanner = ({ category, title, readTime, date, index = 0 }: BlogBannerProps) => {
  const accent = ACCENTS[index % ACCENTS.length];
  const lines = wrapTitle(title, 30);
  const catText = truncate(category.toUpperCase(), 24);

  // Форматируем дату
  const d = new Date(date);
  const dateStr = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <svg
      viewBox="0 0 600 340"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${category}: ${title}`}
    >
      <defs>
        {/* Фон сетки */}
        <pattern id={`grid-${index}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M 26 0 L 0 0 0 26" fill="none" stroke={accent.tag} strokeWidth="0.4" strokeOpacity="0.18" />
        </pattern>
        {/* Горизонтальный градиент акцентной линии */}
        <linearGradient id={`topLine-${index}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="25%" stopColor={accent.tag} />
          <stop offset="75%" stopColor={accent.tag} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        {/* Glow слева */}
        <radialGradient id={`glow-${index}`} cx="0" cy="50%" r="60%">
          <stop offset="0%" stopColor={accent.tag} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        {/* Glow справа */}
        <radialGradient id={`glowR-${index}`} cx="100%" cy="100%" r="50%">
          <stop offset="0%" stopColor={accent.tag} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Фон */}
      <rect width="600" height="340" fill="#080d1a" />

      {/* Сетка */}
      <rect width="600" height="340" fill={`url(#grid-${index})`} />

      {/* Glow пятна */}
      <rect width="600" height="340" fill={`url(#glow-${index})`} />
      <rect width="600" height="340" fill={`url(#glowR-${index})`} />

      {/* Верхняя акцентная линия */}
      <rect y="0" width="600" height="2.5" fill={`url(#topLine-${index})`} />

      {/* Левая вертикальная полоса */}
      <rect x="0" y="0" width="3" height="340" fill={accent.tag} opacity="0.8" />

      {/* Тег категории */}
      <rect x="32" y="36" width={catText.length * 7.2 + 20} height="26" rx="2"
        fill={accent.tag} fillOpacity="0.14"
        stroke={accent.tag} strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="48" cy="49" r="3" fill={accent.tag} />
      <text x="58" y="53.5" fontFamily="Arial, sans-serif" fontSize="10.5"
        fontWeight="700" letterSpacing="2.2" fill={accent.tag} textAnchor="start">
        {catText}
      </text>

      {/* Заголовок */}
      {lines.map((line, i) => (
        <text
          key={i}
          x="32"
          y={98 + i * 38}
          fontFamily="Georgia, serif"
          fontSize="28"
          fontWeight="bold"
          fill="#f0f4ff"
          textAnchor="start"
        >
          {line}
        </text>
      ))}

      {/* Разделитель */}
      <rect x="32" y="272" width="536" height="1" fill={accent.tag} fillOpacity="0.2" />

      {/* Метаданные: дата и время чтения */}
      {/* Иконка часов */}
      <circle cx="45" cy="294" r="8" fill="none" stroke="#7a8ba8" strokeWidth="1.3" />
      <line x1="45" y1="289" x2="45" y2="294" stroke="#7a8ba8" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="45" y1="294" x2="49" y2="296" stroke="#7a8ba8" strokeWidth="1.3" strokeLinecap="round" />
      <text x="59" y="298" fontFamily="Arial, sans-serif" fontSize="11.5" fill="#7a8ba8">
        {readTime}
      </text>

      {/* Иконка календаря */}
      <rect x="108" y="286" width="14" height="13" rx="1.5" fill="none" stroke="#7a8ba8" strokeWidth="1.3" />
      <line x1="112" y1="284" x2="112" y2="288" stroke="#7a8ba8" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="118" y1="284" x2="118" y2="288" stroke="#7a8ba8" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="108" y1="291" x2="122" y2="291" stroke="#7a8ba8" strokeWidth="1.3" />
      <text x="128" y="298" fontFamily="Arial, sans-serif" fontSize="11.5" fill="#7a8ba8">
        {dateStr}
      </text>

      {/* Стрелка «читать» справа */}
      <text x="552" y="298" fontFamily="Arial, sans-serif" fontSize="11.5" fill={accent.tag} textAnchor="end">
        Читать
      </text>
      <line x1="555" y1="293.5" x2="567" y2="293.5" stroke={accent.tag} strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="563,289.5 567,293.5 563,297.5" fill="none" stroke={accent.tag} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default BlogBanner;
