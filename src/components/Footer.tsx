import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  console.log("👣 Footer component rendering...");
  
  const currentYear = new Date().getFullYear();
  
  const handleManualNavTest = () => {
    console.log("🔧 Manual navigation test clicked!");
    console.log("📍 Before navigation:", window.location.href);
    
    // Try manual hash navigation
    window.location.hash = '#/test';
    
    setTimeout(() => {
      console.log("📍 After navigation:", window.location.href);
      console.log("📍 Current hash:", window.location.hash);
    }, 100);
  };
  
  const handleManualAuthTest = () => {
    console.log("🔧 Manual auth navigation test clicked!");
    console.log("📍 Before navigation:", window.location.href);
    
    // Try manual hash navigation
    window.location.hash = '#/auth';
    
    setTimeout(() => {
      console.log("📍 After navigation:", window.location.href);
      console.log("📍 Current hash:", window.location.hash);
    }, 100);
  };
  
  const handleTestClick = (e: React.MouseEvent) => {
    console.log("🧪 Test link clicked!");
    console.log("📍 Current location:", window.location.href);
    console.log("🎯 Will navigate to: /#/test");
    
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    const originalBg = target.style.backgroundColor;
    target.style.backgroundColor = 'green';
    target.style.color = 'white';
    
    setTimeout(() => {
      target.style.backgroundColor = originalBg;
      target.style.color = '';
    }, 500);
  };
  
  const handleAdminClick = (e: React.MouseEvent) => {
    console.log("🖱️ Admin link clicked!");
    console.log("📍 Current location:", window.location.href);
    console.log("🎯 Will navigate to: /#/auth");
    console.log("🔗 Target element:", e.currentTarget);
    
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    const originalBg = target.style.backgroundColor;
    target.style.backgroundColor = 'red';
    target.style.color = 'white';
    
    setTimeout(() => {
      target.style.backgroundColor = originalBg;
      target.style.color = '';
    }, 500);
    
    // Don't prevent default - let React Router handle it
    console.log("✅ Click handler completed, letting React Router handle navigation...");
  };
  
  // Add visual indicator that Footer rendered
  React.useEffect(() => {
    console.log("👣 Footer useEffect running...");
    
    const indicator = document.createElement('div');
    indicator.id = 'footer-debug-indicator';
    indicator.style.cssText = `
      position: fixed; 
      bottom: 10px; 
      left: 10px; 
      background: orange; 
      color: white; 
      padding: 5px 10px; 
      border-radius: 5px; 
      font-size: 12px; 
      z-index: 9999;
      font-family: monospace;
    `;
    indicator.textContent = '👣 Footer Rendered (Hash)';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 4000);
    
    return () => {
      console.log("👣 Footer cleanup...");
    };
  }, []);
  
  console.log("👣 Footer returning JSX...");
  
  return (
    <footer className="bg-muted py-8 mt-16 animate-fade-in">
      <div className="container mx-auto text-center text-muted-foreground">
        <p className="font-playfair text-lg">With Love, L & M</p>
        <p className="text-sm">&copy; {currentYear} | Forever & Always</p>
        <div className="flex justify-center space-x-2 mt-4 flex-wrap">
          <p className="text-xs">Designed with Lovable.dev</p>
          
          {/* Debug and Manual navigation test buttons */}
          <Link 
            to="/debug" 
            className="text-xs hover:text-primary underline transition-colors"
            style={{ 
              border: '2px solid green', 
              padding: '2px 4px',
              background: 'green',
              color: 'white',
              margin: '2px',
              textDecoration: 'none'
            }}
          >
            🐛 DEBUG
          </Link>
          
          <button
            onClick={handleManualNavTest}
            style={{
              border: '2px solid purple',
              padding: '2px 4px',
              background: 'purple',
              color: 'white',
              fontSize: '10px',
              cursor: 'pointer',
              margin: '2px'
            }}
          >
            🔧 Manual Test
          </button>
          
          <button
            onClick={handleManualAuthTest}
            style={{
              border: '2px solid purple',
              padding: '2px 4px',
              background: 'purple',
              color: 'white',
              fontSize: '10px',
              cursor: 'pointer',
              margin: '2px'
            }}
          >
            🔧 Manual Auth
          </button>
          
          {/* Test link to verify routing */}
          <Link 
            to="/test" 
            className="text-xs hover:text-primary underline transition-colors"
            onClick={handleTestClick}
            style={{ 
              border: '2px solid blue', 
              padding: '2px 4px',
              background: 'lightblue',
              color: 'black',
              margin: '2px',
              textDecoration: 'none'
            }}
          >
            🧪 Test (Hash)
          </Link>
          
          {/* Admin link using React Router */}
          <Link 
            to="/#/auth" 
            className="text-xs hover:text-primary underline transition-colors"
            onClick={handleAdminClick}
            style={{ 
              border: '2px solid red', 
              padding: '2px 4px',
              background: 'yellow',
              color: 'black',
              margin: '2px',
              textDecoration: 'none'
            }}
          >
            🔧 Admin (Hash)
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
