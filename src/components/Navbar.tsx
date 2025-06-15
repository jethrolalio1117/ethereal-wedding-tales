
import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, BookOpen, Image, Send } from 'lucide-react';

const navItems = [
  { name: 'Home', path: 'home', icon: Sparkles },
  { name: 'Our Story', path: 'story', icon: BookOpen },
  { name: 'Gallery', path: 'gallery', icon: Image },
  { name: 'RSVP', path: 'rsvp', icon: Send },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coupleNames, setCoupleNames] = useState('L & M');
  const [activeSection, setActiveSection] = useState('home');

  // Handle couple names as before
  useEffect(() => {
    const updateCoupleNames = () => {
      const storedData = localStorage.getItem('homePageData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.coupleNames) {
            // Extract initials from couple names (e.g., "Liam & Mia" -> "L & M")
            const names = parsedData.coupleNames.split(' & ');
            if (names.length === 2) {
              const initials = `${names[0].charAt(0)} & ${names[1].charAt(0)}`;
              setCoupleNames(initials);
            } else {
              setCoupleNames(parsedData.coupleNames);
            }
          }
        } catch (error) {
          console.error('Error parsing stored home data:', error);
        }
      }
    };

    // Initial load
    updateCoupleNames();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homePageData') {
        updateCoupleNames();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const sectionIds = navItems.map(item => item.path);
    const observerOptions = {
      threshold: 0.3,
    };
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <span
            className="text-3xl font-playfair font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            {coupleNames}
          </span>
          <div className="hidden md:flex gap-8"> {/* Increased space between links */}
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.path)}
                className={`
                  relative
                  px-3 py-1 flex items-center space-x-1 group bg-transparent border-none outline-none transition-colors
                  text-foreground hover:text-primary
                  ${activeSection === item.path ? "text-primary font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-primary after:rounded-full after:transition-all after:duration-300" : ""}
                `}
                style={{
                  background: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                }}
              >
                <item.icon size={20} className="group-hover:text-primary transition-colors" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-lg animate-fade-in-up opacity-100" style={{ animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center space-y-4 py-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.path)}
                className={`
                  text-lg flex items-center space-x-2 group bg-transparent border-none outline-none
                  text-foreground hover:text-primary transition-colors
                  ${activeSection === item.path ? "text-primary font-bold" : ""}
                `}
                style={{ background: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
              >
                <item.icon size={20} className="group-hover:text-primary transition-colors" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
