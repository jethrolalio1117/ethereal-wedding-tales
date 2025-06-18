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

const queryClient = new QueryClient();

// Debug component to log route changes
const RouteDebugger = () => {
  console.log('Current pathname:', window.location.pathname);
  console.log('Current URL:', window.location.href);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteDebugger />
          <Routes>
            <Route path="/auth" element={
              <>
                {console.log('Rendering AuthPage route')}
                <AuthPage />
              </>
            } />
            <Route path="/admin" element={
              <>
                {console.log('Rendering AdminPage route')}
                <AdminPage />
              </>
            } />
            <Route path="/" element={
              <>
                {console.log('Rendering Index route')}
                <Layout>
                  <Index />
                </Layout>
              </>
            } />
            {/* Catch-all for any other route */}
            <Route path="*" element={
              <>
                {console.log('Rendering NotFound route for path:', window.location.pathname)}
                <NotFound />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
