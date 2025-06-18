import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const handleAdminClick = (e: React.MouseEvent) => {
    console.log('Admin link clicked!');
    console.log('Current location:', window.location.href);
    // Don't prevent default - let React Router handle it
  };
  
  return (
    <footer className="bg-muted py-8 mt-16 animate-fade-in">
      <div className="container mx-auto text-center text-muted-foreground">
        <p className="font-playfair text-lg">With Love, L & M</p>
        <p className="text-sm">&copy; {currentYear} | Forever & Always</p>
        <div className="flex justify-center space-x-4 mt-4">
          <p className="text-xs">Designed with Lovable.dev</p>
          {/* Admin link using React Router */}
          <Link 
            to="/auth" 
            className="text-xs hover:text-primary underline transition-colors"
            onClick={handleAdminClick}
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
