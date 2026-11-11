import { useEffect } from "react";
import Seo from "@/components/Seo";

const ClientPressroll = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("data-b24-form", "inline/20/funx02");
    script.setAttribute(
      "data-b24-form-telemetry-sign",
      "v1:20:site.fb52e9b84f5510b0bedb302186ac2639af8c3d183f498f258b3c6f2947989a87"
    );
    script.setAttribute("data-skip-moving", "true");
    script.async = true;
    script.src =
      "https://erp.pressroll.ru/upload/crm/form/loader_20_funx02.js?" +
      ((Date.now() / 180000) | 0);

    const container = document.getElementById("b24-form-container");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <Seo
        title="Форма обратной связи"
        description="Форма обратной связи"
        noIndex
      />
      <div
        className="min-h-screen flex items-start justify-center bg-white pt-8 px-4"
      >
        <div id="b24-form-container" className="w-full max-w-2xl" />
      </div>
    </>
  );
};

export default ClientPressroll;
