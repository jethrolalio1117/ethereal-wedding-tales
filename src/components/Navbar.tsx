
import React, { useState, useEffect, useRef } from 'react';
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
  const [activeSection, setActiveSection] = useState<string>('home');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Load couple names from localStorage and create logo
  useEffect(() => {
    const updateCoupleNames = () => {
      const storedData = localStorage.getItem('homePageData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.coupleNames) {
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

    updateCoupleNames();
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

  // Helper function for smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  // Scroll spy effect to highlight current section
  useEffect(() => {
    const handleScroll = () => {
      let found = 'home';
      for (const item of navItems) {
        const section = document.getElementById(item.path);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            found = item.path;
          }
        }
      }
      setActiveSection(found);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Set initial active section (useful on load/refresh)
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div className="hidden md:flex space-x-8"> {/* Increased spacing (was 6) */}
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.path)}
                className={
                  `flex items-center space-x-2 px-4 py-1 rounded-md border-none outline-none font-medium transition-colors
                  bg-transparent relative group
                  ${
                    activeSection === item.path
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full after:scale-x-100 after:origin-bottom-left"
                      : "text-foreground hover:text-primary/80"
                  }
                  `
                }
                style={{ background: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
              >
                <item.icon
                  size={18}
                  className={
                    activeSection === item.path
                      ? "text-primary"
                      : "group-hover:text-primary transition-colors"
                  }
                />
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-lg animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center space-y-4 py-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.path)}
                className={
                  `flex items-center space-x-2 text-lg px-6 py-2 rounded-md transition-all group border-none outline-none
                  bg-transparent
                  ${
                    activeSection === item.path
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground hover:text-primary"
                  }
                  `
                }
                style={{ background: 'none', cursor: 'pointer' }}
              >
                <item.icon
                  size={20}
                  className={
                    activeSection === item.path
                      ? "text-primary"
                      : "group-hover:text-primary transition-colors"
                  }
                />
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
