import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";

console.log("🎯 App.tsx loading...");

const queryClient = new QueryClient();

// Debug component to log route changes
const RouteDebugger = () => {
  console.log('📍 Current pathname:', window.location.pathname);
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
    indicator.textContent = '🔧 App Component Loaded';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 5000);
  }, []);
  
  return null;
};

const App = () => {
  console.log("🚀 App component rendering...");
  
  try {
    console.log("📦 Checking dependencies...");
    console.log("- QueryClient:", !!QueryClient);
    console.log("- BrowserRouter:", !!BrowserRouter);
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
            <BrowserRouter>
              <RouteDebugger />
              <Routes>
                <Route path="/test" element={
                  <>
                    {console.log('🧪 Rendering TestPage route')}
                    <TestPage />
                  </>
                } />
                <Route path="/auth" element={
                  <>
                    {console.log('🔐 Rendering AuthPage route')}
                    <AuthPage />
                  </>
                } />
                <Route path="/admin" element={
                  <>
                    {console.log('👑 Rendering AdminPage route')}
                    <AdminPage />
                  </>
                } />
                <Route path="/" element={
                  <>
                    {console.log('🏠 Rendering Index route')}
                    <Layout>
                      <Index />
                    </Layout>
                  </>
                } />
                {/* Catch-all for any other route */}
                <Route path="*" element={
                  <>
                    {console.log('❓ Rendering NotFound route for path:', window.location.pathname)}
                    <NotFound />
                  </>
                } />
              </Routes>
            </BrowserRouter>
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
