
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, Camera, Mail, Flower2 } from 'lucide-react';
import GuestManagement from '@/components/admin/GuestManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import EmailTools from '@/components/admin/EmailTools';

const AdminPage: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100">
          <Flower2 className="text-purple-500 mx-auto mb-4" size={64} />
          <h1 className="text-2xl font-playfair text-purple-800 mb-2">Access Denied</h1>
          <p className="text-purple-600 mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => navigate('/')} variant="outline" className="border-purple-300 text-purple-700">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-playfair text-purple-800 mb-2">Admin Dashboard</h1>
            <p className="text-purple-600">Manage your ethereal wedding website</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="border-purple-300 text-purple-700">
            <LogOut className="mr-2" size={18} />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 border border-purple-200">
            <TabsTrigger value="guests" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              <Users className="mr-2" size={18} />
              Guest Management
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              <Camera className="mr-2" size={18} />
              Gallery Management
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              <Mail className="mr-2" size={18} />
              Email Tools
            </TabsTrigger>
          </TabsList>

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
