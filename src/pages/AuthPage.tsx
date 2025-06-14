
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, Flower2 } from 'lucide-react';

// NEW: Google Icon SVG
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect authenticated users to admin page
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User is authenticated, redirecting to admin...');
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Don't manually navigate here - let the useEffect handle it
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`
      },
    });
    if (error) {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Flower2 className="text-purple-500 mx-auto mb-4 animate-pulse" size={48} />
          <p className="text-purple-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <Flower2 className="text-purple-500 mx-auto mb-4" size={48} strokeWidth={1.5} />
            <h1 className="text-3xl font-playfair text-purple-800 mb-2">
              {isSignUp ? 'Create Admin Account' : 'Admin Login'}
            </h1>
            <p className="text-purple-600 text-sm">Manage your ethereal wedding website</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-purple-700">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              disabled={loading}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isSignUp ? <UserPlus className="mr-2" size={18} /> : <LogIn className="mr-2" size={18} />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          {/* Google Sign-In Button */}
          {!isSignUp && (
            <div className="mt-6">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-purple-800 border border-purple-200 hover:bg-purple-50 font-medium shadow-none flex items-center justify-center space-x-2"
                disabled={loading}
                variant="outline"
              >
                <GoogleIcon className="mr-2" />
                Continue with Google
              </Button>
              <div className="text-xs text-center text-purple-600 mt-1">
                Only admin accounts are allowed access.
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-600 hover:text-purple-800 text-sm underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
