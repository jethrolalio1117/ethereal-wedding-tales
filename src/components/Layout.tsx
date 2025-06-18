import React from 'react';
import Navbar from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  console.log("🏗️ Layout component rendering...");
  console.log("🏗️ Layout children:", children);
  
  // Add visual indicator that Layout rendered
  React.useEffect(() => {
    console.log("🏗️ Layout useEffect running...");
    
    const indicator = document.createElement('div');
    indicator.id = 'layout-debug-indicator';
    indicator.style.cssText = `
      position: fixed; 
      top: 90px; 
      left: 10px; 
      background: purple; 
      color: white; 
      padding: 5px 10px; 
      border-radius: 5px; 
      font-size: 12px; 
      z-index: 9999;
      font-family: monospace;
    `;
    indicator.textContent = '🏗️ Layout Rendered';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 4000);
    
    return () => {
      console.log("🏗️ Layout cleanup...");
    };
  }, []);
  
  console.log("🏗️ Layout about to render Navbar, main content, and Footer...");
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {console.log("🧭 Rendering Navbar...")}
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {console.log("📄 Rendering main content...")}
        {children}
      </main>
      {console.log("👣 About to render Footer...")}
      <Footer />
      {console.log("✅ Layout render complete")}
    </div>
  );
};

export default Layout;
