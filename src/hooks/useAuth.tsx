
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 10000)
      );
      
      const queryPromise = supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      const { data: profile, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Error fetching profile:', error);
        setIsAdmin(false);
      } else {
        console.log('Profile data:', profile);
        const adminStatus = profile?.role === 'admin';
        console.log('Is admin:', adminStatus);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error('Error in admin check:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session first
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session:', initialSession?.user?.email);
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            await checkAdminStatus(initialSession.user.id);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
          setIsAdmin(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await checkAdminStatus(session.user.id);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      }
    );

    // Get initial session
    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
