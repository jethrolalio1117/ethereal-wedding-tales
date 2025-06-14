
import React from 'react';
import { BookHeart } from 'lucide-react';

const StoryPage: React.FC = () => {
  return (
    <div className="py-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-lg shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <BookHeart className="text-primary mb-4" size={64} strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-playfair text-center text-primary mb-4">Our Love Story</h1>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-8 text-lg text-foreground/80 leading-relaxed">
          <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-playfair text-secondary mb-3">The First Spark</h2>
            <p>
              It all began on a crisp autumn evening, under a sky full of stars. We met at a small, cozy bookstore cafe, drawn together by a shared love for classic literature and strong coffee. What started as a simple conversation about our favorite authors soon blossomed into something much more profound. We talked for hours, lost in our own world, oblivious to the time passing by.
            </p>
          </section>

          <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-playfair text-secondary mb-3">Adventures Together</h2>
            <p>
              From that day forward, our lives became an exciting adventure. We explored hidden city gems, hiked through breathtaking landscapes, and shared countless laugh-filled dinners. Each moment, whether big or small, wove another thread into the beautiful tapestry of our relationship. We discovered not just a partner in each other, but a best friend, a confidant, and a soulmate.
            </p>
          </section>

          <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-playfair text-secondary mb-3">The Proposal</h2>
            <p>
              On a serene beach, with the sun setting in a blaze of glory, painting the sky in hues of orange and purple, one of us got down on one knee. It was a moment suspended in time, filled with happy tears, heartfelt promises, and an overwhelming sense of joy. The answer was a resounding "Yes!" – a promise of forever.
            </p>
          </section>

          <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-playfair text-secondary mb-3">Our Next Chapter</h2>
            <p>
              Now, we stand on the cusp of our greatest adventure yet – marriage. We are so excited to celebrate our love with all of you, our cherished family and friends. Your presence will make our special day even more memorable as we embark on this beautiful journey together, hand in hand, heart to heart.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
