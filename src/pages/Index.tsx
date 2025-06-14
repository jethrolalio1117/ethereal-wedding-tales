
import { Heart, Calendar, MapPin, Flower2 } from 'lucide-react';
import { useHomePageData } from '@/hooks/useHomePageData';

const Index = () => {
  const { data, loading } = useHomePageData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Flower2 className="text-purple-500 mx-auto mb-4 animate-pulse" size={64} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Florals */}
      <section 
        className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden"
        style={{ backgroundImage: `url(${data.backgroundImage})` }}
      >
        {/* Floating Floral Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-pink-300 opacity-30 animate-pulse">
            <Flower2 size={80} className="animate-bounce" />
          </div>
          <div className="absolute top-32 right-20 text-purple-300 opacity-25 animate-pulse delay-1000">
            <Flower2 size={60} className="animate-float" />
          </div>
          <div className="absolute bottom-32 left-16 text-pink-400 opacity-20 animate-pulse delay-2000">
            <Flower2 size={70} className="animate-bounce" />
          </div>
          <div className="absolute bottom-20 right-32 text-purple-400 opacity-30 animate-pulse delay-500">
            <Flower2 size={50} className="animate-float" />
          </div>
          {/* Scattered petals */}
          <div className="absolute top-1/4 left-1/3 text-pink-200 opacity-20 animate-spin-slow">
            <div className="w-4 h-4 bg-pink-300 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-1/2 right-1/4 text-purple-200 opacity-25 animate-spin-slow delay-1000">
            <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-pink-200 opacity-20 animate-spin-slow delay-2000">
            <div className="w-5 h-5 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen text-center text-white px-4">
          <div className="max-w-4xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="mb-8 relative">
              <Flower2 className="text-white/80 mx-auto mb-6 animate-pulse" size={64} strokeWidth={1} />
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair mb-4 tracking-wide leading-tight">
                {data.coupleNames}
              </h1>
              <div className="w-32 h-1 bg-white/60 mx-auto rounded-full mb-6"></div>
              <p className="text-xl md:text-2xl lg:text-3xl font-light tracking-widest opacity-90">
                are getting married
              </p>
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
      </section>

      {/* Love Story Section with Enhanced Design */}
      <section className="py-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Florals */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-pink-400">
            <Flower2 size={200} />
          </div>
          <div className="absolute bottom-20 right-10 text-purple-400">
            <Flower2 size={150} />
          </div>
        </div>

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
            {/* Story chapters with enhanced design */}
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-pink-100 opacity-50">
                  <Flower2 size={120} />
                </div>
                <h3 className="text-2xl md:text-3xl font-playfair text-pink-800 mb-6 relative z-10">The First Spark</h3>
                <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory.firstSpark}</p>
              </div>
            </div>

            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 text-purple-100 opacity-50">
                  <Flower2 size={100} />
                </div>
                <h3 className="text-2xl md:text-3xl font-playfair text-purple-800 mb-6 relative z-10">Adventures Together</h3>
                <p className="text-lg leading-relaxed text-gray-700 relative z-10">{data.loveStory.adventures}</p>
              </div>
            </div>

            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-100 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-pink-100 opacity-50">
                  <Flower2 size={110} />
                </div>
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
      </section>
    </div>
  );
};

export default Index;
