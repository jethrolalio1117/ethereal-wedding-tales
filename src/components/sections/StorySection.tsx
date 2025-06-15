import { Heart, Flower2 } from 'lucide-react';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useSectionInView } from '@/hooks/useSectionInView';

const StorySection = () => {
  const { data } = useHomePageData();
  const [sectionRef, inView] = useSectionInView();

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className={`py-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden transition-all duration-1000 ${
        inView ? "animate-heart-pulse" : ""
      }`}
    >
      {/* Background Florals */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-pink-400"><Flower2 size={200} /></div>
        <div className="absolute bottom-20 right-10 text-purple-400"><Flower2 size={150} /></div>
      </div>
      {/* Animated decorative hearts */}
      {inView && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[1,2,3,4].map((v,i)=>(
            <Heart
              key={i}
              className="absolute pulse"
              style={{
                left: `${15 + i * 20}%`,
                top: `${30 + i * 8}%`,
                opacity: 0.22 + i * 0.1,
                color: i%2 ? "#f472b6" : "#d1b1ff",
                animationDelay: `${i * 0.3}s`,
                zIndex: 1,
              }}
              size={32 + i*5}
              strokeWidth={1.1}
            />
          ))}
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-center mb-6">
            <Heart className="text-pink-600 mr-3" size={40} strokeWidth={1.5} />
            <h2 className="text-4xl md:text-6xl font-playfair text-pink-800">Our Love Story</h2>
            <Heart className="text-pink-600 ml-3" size={40} strokeWidth={1.5} />
          </div>
          <div className="w-32 h-1 bg-pink-300 mx-auto rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-pink-100 opacity-50"><Flower2 size={120} /></div>
              <h3 className="text-2xl md:text-3xl font-playfair text-pink-800 mb-6 relative z-10">The First Spark</h3>
              <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory.firstSpark}</p>
            </div>
          </div>
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 text-purple-100 opacity-50"><Flower2 size={100} /></div>
              <h3 className="text-2xl md:text-3xl font-playfair text-purple-800 mb-6 relative z-10">Adventures Together</h3>
              <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory.adventures}</p>
            </div>
          </div>
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-100 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-pink-100 opacity-50"><Flower2 size={110} /></div>
              <h3 className="text-2xl md:text-3xl font-playfair text-pink-800 mb-6 relative z-10">The Proposal</h3>
              <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory.proposal}</p>
            </div>
          </div>
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-200 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <Flower2 className="absolute top-4 right-4 text-pink-400" size={80} />
                <Flower2 className="absolute bottom-4 left-4 text-purple-400" size={60} />
              </div>
              <h3 className="text-2xl md:text-3xl font-playfair text-purple-800 mb-6 relative z-10">Our Next Chapter</h3>
              <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory.nextChapter}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorySection;
