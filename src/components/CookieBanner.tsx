import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "gc_cookies_accepted";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 md:py-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-primary-foreground/80 text-center sm:text-left">
          Пользуясь нашим сайтом, вы соглашаетесь с тем, что мы используем cookies и
          с{" "}
          <Link
            to="/privacy"
            className="text-accent hover:underline"
          >
            политикой обработки персональных данных
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
