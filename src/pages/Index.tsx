
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, CalendarDays, MapPin } from 'lucide-react';

const Index: React.FC = () => {
  // Placeholder image - ideally, the couple would provide their own.
  const heroImageUrl = "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-32 md:py-48 rounded-lg shadow-2xl overflow-hidden animate-fade-in opacity-0"
        style={{ backgroundImage: `url(${heroImageUrl})`, animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-playfair mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Liam & Mia
          </h1>
          <p className="text-xl md:text-2xl font-lato mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            Are joyfully inviting you to celebrate their wedding
          </p>
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3">
              <Link to="/rsvp">RSVP Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Message & Details Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <Heart className="text-primary mx-auto mb-6" size={56} strokeWidth={1.5}/>
          <h2 className="text-4xl font-playfair text-primary mb-6">Join Us for Our Special Day</h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-8">
            We are so excited to begin our new journey together and can't wait to share this magical day with our dearest family and friends. 
            Your love and support mean the world to us. Explore our website to find out more about our story, view our gallery, and RSVP to our celebration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <CalendarDays size={28} className="text-secondary mr-3" />
                <h3 className="text-2xl font-playfair text-secondary">Date & Time</h3>
              </div>
              <p className="text-foreground/70">Saturday, October 25th, 2025</p>
              <p className="text-foreground/70">Ceremony at 3:00 PM</p>
              <p className="text-foreground/70">Reception to follow</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <MapPin size={28} className="text-secondary mr-3" />
                <h3 className="text-2xl font-playfair text-secondary">Location</h3>
              </div>
              <p className="text-foreground/70">The Enchanted Gardens</p>
              <p className="text-foreground/70">123 Dreamy Lane, Wonderland</p>
              <Link to="#" className="text-primary hover:underline text-sm mt-1 inline-block">View Map</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action to other pages */}
      <section className="py-16 bg-muted rounded-lg">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-playfair text-primary mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>Discover More</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
                    <Button asChild variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 text-md">
                        <Link to="/story">Our Love Story</Link>
                    </Button>
                </div>
                <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
                    <Button asChild variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 text-md">
                        <Link to="/gallery">Photo Gallery</Link>
                    </Button>
                </div>
                <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
                    <Button asChild variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 text-md">
                        <Link to="/rsvp">Send Your RSVP</Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
