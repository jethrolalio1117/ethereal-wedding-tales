import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LogOut, Users, Camera, Mail, Home, Flower2, MailCheck } from 'lucide-react';
import GuestManagement from '@/components/admin/GuestManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import EmailTools from '@/components/admin/EmailTools';
import HomeManagement from '@/components/admin/HomeManagement';
import RSVPManagement from '@/components/admin/RSVPManagement';

const AdminPage: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  console.log('AdminPage render - loading:', loading, 'user:', user?.email, 'isAdmin:', isAdmin);

  // Show loading while auth is being determined
  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {/* Floating floral elements */}
        <div className="absolute top-10 left-10 text-pink-300 opacity-30 animate-bounce">
          <Flower2 size={60} className="animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-20 text-purple-300 opacity-20 animate-pulse">
          <Flower2 size={80} />
        </div>
        <div className="text-center">
          <Flower2 className="text-purple-500 mx-auto mb-4 animate-pulse" size={64} />
          <p className="text-purple-600 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    console.log('No user, redirecting to auth');
    navigate('/#/auth');
    return null;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    console.log('User not admin, showing access denied');
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200">
          <Flower2 className="text-pink-500 mx-auto mb-4" size={64} />
          <h1 className="text-2xl font-playfair text-pink-800 mb-2">Access Denied</h1>
          <p className="text-pink-600 mb-4">You need admin privileges to access this page.</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/#/')} variant="outline" className="border-pink-300 text-pink-700 w-full">
              Return to Home
            </Button>
            <Button onClick={() => signOut()} variant="ghost" className="text-pink-600 w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/#/');
  };

  console.log('Rendering admin dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Floating floral decorations */}
      <div className="absolute top-5 right-5 text-pink-300 opacity-20 animate-pulse">
        <Flower2 size={40} />
      </div>
      <div className="absolute bottom-10 left-5 text-purple-300 opacity-15 animate-bounce">
        <Flower2 size={50} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-playfair text-pink-800 mb-2">Admin Dashboard</h1>
            <p className="text-pink-600">Manage your ethereal wedding website</p>
            <p className="text-sm text-pink-500">Welcome, {user.email}</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                <LogOut className="mr-2" size={18} />
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out of the admin panel?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut} className="bg-pink-600 hover:bg-pink-700">
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 border border-pink-200 shadow-lg">
            <TabsTrigger value="home" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
              <Home className="mr-2" size={18} />
              Home
            </TabsTrigger>
            <TabsTrigger value="rsvp" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
              <MailCheck className="mr-2" size={18} />
              RSVP
            </TabsTrigger>
            <TabsTrigger value="guests" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
              <Users className="mr-2" size={18} />
              Guests
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
              <Camera className="mr-2" size={18} />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
              <Mail className="mr-2" size={18} />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <HomeManagement />
          </TabsContent>

          <TabsContent value="rsvp" className="mt-6">
            <RSVPManagement />
          </TabsContent>

          <TabsContent value="guests" className="mt-6">
            <GuestManagement />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryManagement />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <EmailTools />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
