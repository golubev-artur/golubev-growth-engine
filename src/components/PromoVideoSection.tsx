import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const PromoVideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            За 30 секунд о главном
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Что получает ваша компания
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative group cursor-pointer" onClick={toggle}>
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <video
              ref={videoRef}
              src="/promo.mp4"
              className="w-full"
              playsInline
              onEnded={() => setPlaying(false)}
            />
          </div>

          {/* Play/Pause overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
            <div className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              {playing
                ? <Pause className="w-8 h-8 text-white" />
                : <Play  className="w-8 h-8 text-white ml-1" />
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoVideoSection;
