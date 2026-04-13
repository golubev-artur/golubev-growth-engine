import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";

const Privacy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      <Seo
        title="Политика обработки персональных данных"
        description="Политика обработки персональных данных на сайте golubev-consulting.ru. Информация о сборе, хранении и использовании данных."
        path="/privacy"
      />
      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight leading-[1.12]">
            Политика обработки персональных данных
          </h1>
          <p className="text-primary-foreground/60 text-lg mt-4">
            Дата последнего обновления: 13 апреля 2026 г.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <article className="container mx-auto px-4 md:px-8 max-w-3xl">

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">1. Общие положения</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Настоящая Политика обработки персональных данных (далее — Политика) действует в отношении всей информации, которую сайт{" "}
            <Link to="/" className="text-accent hover:underline">golubev-consulting.ru</Link> (далее — Сайт), принадлежащий Golubev Consulting (далее — Оператор), может получить о пользователе во время использования Сайта.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">2. Какие данные мы собираем</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            При использовании Сайта Оператор может собирать следующие данные:
          </p>
          <ul className="space-y-2 my-3">
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              <strong className="text-foreground">Данные из форм обратной связи</strong> — имя, номер телефона, адрес электронной почты, текст сообщения, которые вы указываете при заполнении{" "}
              <Link to="/services" className="text-accent hover:underline">форм на страницах услуг</Link> и в{" "}
              <Link to="/blog" className="text-accent hover:underline">блоге</Link>.
            </li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              <strong className="text-foreground">Технические данные</strong> — IP-адрес, тип браузера, операционная система, разрешение экрана, источник перехода на Сайт, информация о просмотренных страницах и времени, проведённом на Сайте.
            </li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              <strong className="text-foreground">Данные cookies</strong> — небольшие текстовые файлы, которые сохраняются на вашем устройстве для обеспечения работы Сайта и анализа его использования.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">3. Цели обработки данных</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Персональные данные пользователей обрабатываются в следующих целях:</p>
          <ul className="space-y-2 my-3">
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Обработка входящих запросов и обратная связь с пользователем</li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Улучшение качества работы Сайта и его содержимого</li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Анализ поведения пользователей для улучшения пользовательского опыта</li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Предоставление информации об{" "}
              <Link to="/services" className="text-accent hover:underline">услугах Golubev Consulting</Link>
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">4. Использование cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Сайт использует следующие типы cookies:
          </p>
          <ul className="space-y-2 my-3">
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              <strong className="text-foreground">Необходимые cookies</strong> — обеспечивают корректную работу Сайта, запоминание ваших предпочтений (например, согласие с данной Политикой).
            </li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              <strong className="text-foreground">Аналитические cookies</strong> — используются сервисом Яндекс.Метрика для сбора статистики посещений, анализа поведения пользователей, оценки эффективности содержимого Сайта. Данные собираются в обезличенной форме.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Вы можете отключить cookies в настройках вашего браузера. Обратите внимание, что отключение cookies может повлиять на функциональность Сайта.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">5. Защита данных</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">6. Передача данных третьим лицам</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Оператор не передаёт персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации. Аналитические данные обрабатываются сервисом Яндекс.Метрика в соответствии с их собственной политикой конфиденциальности.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">7. Хранение данных</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Персональные данные, предоставленные через формы обратной связи, хранятся в течение срока, необходимого для обработки запроса и дальнейшего взаимодействия с пользователем, но не более 3 (трёх) лет с момента получения данных.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">8. Права пользователей</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Вы имеете право:</p>
          <ul className="space-y-2 my-3">
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Получить информацию о хранящихся персональных данных</li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Потребовать уточнения, блокирования или уничтожения персональных данных</li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">Отозвать согласие на обработку персональных данных</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Для реализации указанных прав направьте запрос на адрес электронной почты: <a href="mailto:info@golubev-consulting.ru" className="text-accent hover:underline">info@golubev-consulting.ru</a>.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">9. Изменение Политики</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Оператор оставляет за собой право вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента её размещения на Сайте. Продолжение использования Сайта после внесения изменений означает ваше согласие с новой редакцией Политики.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">10. Контактная информация</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться:
          </p>
          <ul className="space-y-2 my-3">
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              Email: <a href="mailto:info@golubev-consulting.ru" className="text-accent hover:underline">info@golubev-consulting.ru</a>
            </li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              Телефон: <a href="tel:+79001234567" className="text-accent hover:underline">+7 (900) 123-45-67</a>
            </li>
            <li className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-accent/30">
              Сайт: <Link to="/" className="text-accent hover:underline">golubev-consulting.ru</Link>
            </li>
          </ul>

          <div className="mt-12 pt-8 border-t border-border">
            <Link to="/" className="text-accent hover:underline text-sm">← Вернуться на главную</Link>
          </div>
        </article>
      </section>
    </Layout>
  );
};

export default Privacy;
