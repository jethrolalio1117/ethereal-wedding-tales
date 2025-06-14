
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted py-8 mt-16 animate-fade-in">
      <div className="container mx-auto text-center text-muted-foreground">
        <p className="font-playfair text-lg">With Love, L & M</p>
        <p className="text-sm">&copy; {currentYear} | Forever & Always</p>
        <p className="text-xs mt-2">Designed with Lovable.dev</p>
      </div>
    </footer>
  );
};

export default Footer;
