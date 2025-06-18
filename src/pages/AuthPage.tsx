import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Flower2 } from 'lucide-react';
import Layout from '@/components/Layout';

// Google Icon SVG
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 48 48" width={20} height={20} fill="none">
    <g>
      <path fill="#FFC107" d="M43.611 20.083h-1.943v-.083H24v7.917h11.232c-1.611 4.506-5.93 7.75-11.232 7.75-6.627 0-12-5.373-12-12s5.373-12 12-12c2.934 0 5.617 1.057 7.722 2.791l5.821-5.821C34.476 7.089 29.617 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.522 4.785C14.68 16.09 19.018 13 24 13c2.934 0 5.617 1.057 7.722 2.791l5.821-5.821C34.476 7.089 29.617 5 24 5c-7.246 0-13.397 3.893-17.056 9.691z"/>
      <path fill="#4CAF50" d="M24 45c5.445 0 10.399-1.866 14.246-5.06l-6.614-5.603C29.096 36.754 26.673 37.5 24 37.5c-5.282 0-9.787-3.396-11.405-8.057l-6.477 4.998C8.572 41.019 15.63 45 24 45z"/>
      <path fill="#1976D2" d="M43.611 20.083h-1.943v-.083H24v7.917h11.232c-1.02 2.854-3.002 5.097-5.646 6.443.001 0 .001.001.002.001l6.614 5.603C39.333 41.447 44 37 44 25c0-1.341-.138-2.651-.389-3.917z"/>
    </g>
  </svg>
);

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();

  console.log('AuthPage render - authLoading:', authLoading, 'user:', user?.email, 'isAdmin:', isAdmin);

  // Redirect authenticated admin users immediately
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      console.log('🔐 User authenticated as admin, redirecting to /admin');
      navigate('/admin', { replace: true });
    }
  }, [user, authLoading, isAdmin, navigate]);

  // Handle OAuth redirect from Google
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session && !error) {
        console.log('🔗 OAuth session detected, user:', data.session.user.email);
        // Let the auth system handle the redirect via the above useEffect
      }
    };

    // Check if this is an OAuth callback (has authentication fragments)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('access_token') || hashParams.get('error')) {
      console.log('🔗 OAuth callback detected');
      handleAuthCallback();
    }
  }, []);



  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    console.log('🔐 Starting Google Sign In');
    console.log('🌐 Current origin:', window.location.origin);
    
    // For HashRouter, redirect to the base URL and let the app handle routing
    const isProduction = window.location.hostname === 'lalio-villaruz-wedding.xyz';
    const redirectUrl = isProduction 
      ? 'https://lalio-villaruz-wedding.xyz/'
      : `${window.location.origin}/`;
    
    console.log('🔗 Redirect URL will be:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account', // Force account selection every time
          access_type: 'offline'
        }
      },
    });
    
    if (error) {
      console.error('❌ Google OAuth error:', error);
      toast({
        title: "Google Sign-In Error",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Show loading while auth is being determined
  if (authLoading) {
    console.log('Auth loading, showing spinner');
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Flower2 className="text-purple-500 mx-auto mb-4 animate-pulse" size={48} />
            <p className="text-purple-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show access denied message if user is logged in but not admin
  if (user && !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="text-center mb-8">
                <Flower2 className="text-purple-500 mx-auto mb-4" size={48} strokeWidth={1.5} />
                <h1 className="text-3xl font-playfair text-purple-800 mb-2">Access Denied</h1>
                <p className="text-purple-600 text-sm mb-4">You are signed in as {user.email}, but you don't have admin privileges.</p>
                <div className="space-y-2">
                  <Button onClick={() => navigate('/')} variant="outline" className="border-purple-300 text-purple-700 w-full">
                    Return to Home
                  </Button>
                  <Button onClick={async () => {
                    await supabase.auth.signOut();
                  }} variant="ghost" className="text-purple-600 w-full">
                    Sign Out & Try Different Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <Flower2 className="text-purple-500 mx-auto mb-4" size={64} strokeWidth={1.5} />
            <h1 className="text-4xl font-playfair text-purple-800 mb-4">
              Admin Login
            </h1>
            <p className="text-purple-600 text-lg mb-2">Manage your ethereal wedding website</p>
            <p className="text-purple-500 text-sm">Sign in with your authorized Google account</p>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-purple-800 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 font-medium text-lg py-4 flex items-center justify-center space-x-3 transition-all duration-200"
              disabled={loading}
              variant="outline"
            >
              <GoogleIcon />
              <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-purple-600 bg-purple-50 p-3 rounded-lg">
                <span className="font-medium">🔒 Admin Access Only</span><br/>
                Only authorized admin accounts can access the wedding management dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default AuthPage;
