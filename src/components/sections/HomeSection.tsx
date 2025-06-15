import { Flower2, Calendar, MapPin } from 'lucide-react';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useSectionInView } from '@/hooks/useSectionInView';
import React from 'react';

const HomeSection = () => {
  const { data, loading } = useHomePageData();
  const [sectionRef, inView] = useSectionInView();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Flower2 className="text-purple-500 mx-auto mb-4 animate-pulse" size={64} />
      </div>
    );
  }

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className={`min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden transition-all duration-1000 ${
        inView ? "petal-burst" : ""
      }`}
    >
      {/* Animated Petal Burst Overlay */}
      {inView && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute petal-burst-petal"
              style={{
                left: '50%',
                top: '50%',
                width: `${18 + Math.random()*22}px`,
                height: `${18 + Math.random()*24}px`,
                background: `radial-gradient(circle, #f8bbd0 ${60+Math.random()*20}%, transparent 100%)`,
                borderRadius: "9999px",
                opacity: 0.20 + Math.random()*0.25,
                transform: `translate(-50%, -50%) rotate(${i*30}deg) scale(0.7)`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Floral Elements and overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* ... keep floral icon overlays ... */}
        <div className="absolute top-10 left-10 text-pink-300 opacity-30 animate-pulse"><Flower2 size={80} className="animate-bounce" /></div>
        <div className="absolute top-32 right-20 text-purple-300 opacity-25 animate-pulse delay-1000"><Flower2 size={60} className="animate-float" /></div>
        <div className="absolute bottom-32 left-16 text-pink-400 opacity-20 animate-pulse delay-2000"><Flower2 size={70} className="animate-bounce" /></div>
        <div className="absolute bottom-20 right-32 text-purple-400 opacity-30 animate-pulse delay-500"><Flower2 size={50} className="animate-float" /></div>
        {/* Sparkle petals */}
        {inView && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute sparkle"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 70}%`,
                  width: `${6 + Math.random() * 16}px`,
                  height: `${6 + Math.random() * 16}px`,
                  background: "radial-gradient(circle, #f8bbd0bd 60%, transparent 100%)",
                  borderRadius: "9999px",
                  opacity: 0.5 + Math.random() * 0.3,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
        {/* Scattered petals */}
        <div className="absolute top-1/4 left-1/3 text-pink-200 opacity-20 animate-spin-slow"><div className="w-4 h-4 bg-pink-300 rounded-full animate-pulse"></div></div>
        <div className="absolute top-1/2 right-1/4 text-purple-200 opacity-25 animate-spin-slow delay-1000"><div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div></div>
        <div className="absolute bottom-1/3 left-1/4 text-pink-200 opacity-20 animate-spin-slow delay-2000"><div className="w-5 h-5 bg-pink-400 rounded-full animate-pulse"></div></div>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen text-center text-white px-4">
        <div className="max-w-4xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          {/* ... keep heading, names, date, details ... */}
          <div className="mb-8 relative">
            <Flower2 className="text-white/80 mx-auto mb-6 animate-pulse" size={64} strokeWidth={1} />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair mb-4 tracking-wide leading-tight">{data.coupleNames}</h1>
            <div className="w-32 h-1 bg-white/60 mx-auto rounded-full mb-6"></div>
            <p className="text-xl md:text-2xl lg:text-3xl font-light tracking-widest opacity-90">are getting married</p>
          </div>
          <div className="space-y-4 text-lg md:text-xl bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="text-pink-200" size={24} />
              <span className="font-light">{data.weddingDate} at {data.ceremonyTime}</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="text-pink-200" size={24} />
              <span className="font-light">{data.venueName}</span>
            </div>
            <div className="text-sm opacity-80">{data.venueAddress}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
