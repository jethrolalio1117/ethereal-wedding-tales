
import { Heart, Flower2 } from 'lucide-react';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useSectionInView } from '@/hooks/useSectionInView';

const sections = [
  { key: 'firstSpark', label: 'The First Spark', color: 'text-pink-800', border: 'border-pink-100', flowerColor: 'text-pink-100' },
  { key: 'adventures', label: 'Adventures Together', color: 'text-purple-800', border: 'border-purple-100', flowerColor: 'text-purple-100' },
  { key: 'proposal', label: 'The Proposal', color: 'text-pink-800', border: 'border-pink-100', flowerColor: 'text-pink-100' },
  { key: 'nextChapter', label: 'Our Next Chapter', color: 'text-purple-800', border: 'border-pink-200', flowerColor: 'text-pink-400' },
];

const StorySection = () => {
  const { data } = useHomePageData();
  const [sectionRef, inView] = useSectionInView();

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className={`py-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden transition-all duration-1000 ${
        inView ? "animate-fade-in-up" : ""
      }`}
    >
      {/* Soft floating backgrounds */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute top-20 left-10 text-pink-400"><Flower2 size={200} /></div>
        <div className="absolute bottom-20 right-10 text-purple-400"><Flower2 size={150} /></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 opacity-0`} style={inView ? { animation: "fade-in-up 0.8s forwards", animationDelay: "0.15s" } : {}}>
          <div className="flex items-center justify-center mb-6">
            <Heart className="text-pink-600 mr-3" size={40} strokeWidth={1.5} />
            <h2 className="text-4xl md:text-6xl font-playfair text-pink-800">Our Love Story</h2>
            <Heart className="text-pink-600 ml-3" size={40} strokeWidth={1.5} />
          </div>
          <div className="w-32 h-1 bg-pink-300 mx-auto rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((s, idx) => (
            <div key={s.key}
              className={`storybook-card relative ${s.border} opacity-0`}
              style={inView ? { animation: `fade-in-up 0.9s forwards`, animationDelay: `${0.30 + idx * 0.13}s` } : {}}
            >
              <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border relative overflow-hidden`}>
                <div className={`absolute ${idx%2? 'bottom-0 left-0':'top-0 right-0'} ${s.flowerColor} opacity-50`} style={{zIndex: 0}}>
                  <Flower2 size={idx %2 ? 100 : 120} />
                </div>
                <h3 className={`text-2xl md:text-3xl font-playfair ${s.color} mb-6 relative z-10`}>{s.label}</h3>
                <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory[s.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorySection;
