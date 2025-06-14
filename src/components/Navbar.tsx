
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles, BookOpen, Image, Send } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Sparkles },
  { name: 'Our Story', path: '/story', icon: BookOpen },
  { name: 'Gallery', path: '/gallery', icon: Image },
  { name: 'RSVP', path: '/rsvp', icon: Send },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-playfair font-bold text-primary hover:text-primary/80 transition-colors">
            L & M
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors flex items-center space-x-1 group"
              >
                <item.icon size={18} className="group-hover:text-primary transition-colors" />
                <span>{item.name}</span>
              </Link>
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
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-lg flex items-center space-x-2 group"
              >
                <item.icon size={20} className="group-hover:text-primary transition-colors" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
