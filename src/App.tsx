import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import DebugPage from "./pages/DebugPage";
import GalleryPage from "./pages/GalleryPage";
import StoryPage from "./pages/StoryPage";
import RSVPPage from "./pages/RSVPPage";
import './App.css';

console.log("🎯 App.tsx loading...");

const queryClient = new QueryClient();

// Debug component to log route changes
const RouteDebugger = () => {
  console.log('📍 Current pathname:', window.location.pathname);
  console.log('📍 Current hash:', window.location.hash);
  console.log('📍 Current URL:', window.location.href);
  return null;
};

// Debug component to show app status
const DebugIndicator = () => {
  console.log("🔧 DebugIndicator rendering...");
  
  React.useEffect(() => {
    const indicator = document.createElement('div');
    indicator.id = 'app-debug-indicator';
    indicator.style.cssText = `
      position: fixed; 
      top: 50px; 
      left: 10px; 
      background: blue; 
      color: white; 
      padding: 5px 10px; 
      border-radius: 5px; 
      font-size: 12px; 
      z-index: 9999;
      font-family: monospace;
    `;
    indicator.textContent = '🔧 App Component Loaded (HashRouter)';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 5000);
  }, []);
  
  return null;
};

const App = () => {
  console.log("🚀 App component initializing...");
  console.log('📍 Current URL:', window.location.href);
  console.log('🏠 Origin:', window.location.origin);
  console.log('📦 Hash:', window.location.hash);
  
  try {
    console.log("📦 Checking dependencies...");
    console.log("- QueryClient:", !!QueryClient);
    console.log("- HashRouter:", !!Router);
    console.log("- AuthProvider:", !!AuthProvider);
    console.log("- Layout:", !!Layout);
    console.log("- Index:", !!Index);
    console.log("- AuthPage:", !!AuthPage);
    console.log("- AdminPage:", !!AdminPage);
    
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <DebugIndicator />
            <Router>
              <RouteDebugger />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/rsvp" element={<RSVPPage />} />
                <Route path="/debug" element={<DebugPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("💥 Error in App component:", error);
    
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'red',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'Arial',
        textAlign: 'center',
        maxWidth: '400px',
        zIndex: 10000
      }}>
        <h2>❌ App Component Error</h2>
        <p><strong>Error:</strong> {error.message}</p>
        <p>Check the browser console for more details.</p>
      </div>
    );
  }
};

export default App;
