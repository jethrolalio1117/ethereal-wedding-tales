
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Heart, Image, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHomePageData } from '@/hooks/useHomePageData';

const HomeManagement: React.FC = () => {
  const { toast } = useToast();
  const { data, updateData } = useHomePageData();
  const [isSaving, setIsSaving] = useState(false);

  // Local state for form
  const [formData, setFormData] = useState(data);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      updateData(formData);
      
      toast({
        title: "Settings Saved",
        description: "Home page content has been updated successfully. Changes are now live!",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving home page data:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-playfair text-purple-800">Home Page Management</h2>
          <p className="text-purple-600">Customize your wedding website's home page content</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {/* Hero Section Management */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Image className="mr-2 h-5 w-5" />
            Hero Section
          </CardTitle>
          <CardDescription>Manage the main banner and couple names</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="backgroundImage" className="text-purple-700">Background Image URL</Label>
            <Input
              id="backgroundImage"
              value={formData.backgroundImage}
              onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
              placeholder="Enter image URL"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="coupleNames" className="text-purple-700">Couple Names</Label>
            <Input
              id="coupleNames"
              value={formData.coupleNames}
              onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
              placeholder="e.g., John & Jane"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wedding Details Management */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Calendar className="mr-2 h-5 w-5" />
            Wedding Details
          </CardTitle>
          <CardDescription>Update date, time, and location information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weddingDate" className="text-purple-700">Wedding Date</Label>
              <Input
                id="weddingDate"
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                placeholder="e.g., October 25th, 2025"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="ceremonyTime" className="text-purple-700">Ceremony Time</Label>
              <Input
                id="ceremonyTime"
                value={formData.ceremonyTime}
                onChange={(e) => setFormData({ ...formData, ceremonyTime: e.target.value })}
                placeholder="e.g., 3:00 PM"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <MapPin className="mr-2 h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-purple-800">Venue Information</h4>
            </div>
            <div>
              <Label htmlFor="venueName" className="text-purple-700">Venue Name</Label>
              <Input
                id="venueName"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                placeholder="e.g., The Enchanted Gardens"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="venueAddress" className="text-purple-700">Venue Address</Label>
              <Input
                id="venueAddress"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                placeholder="e.g., 123 Dreamy Lane, Wonderland"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Love Story Management */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Heart className="mr-2 h-5 w-5" />
            Love Story Content
          </CardTitle>
          <CardDescription>Edit the sections of your love story</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="firstSpark" className="text-purple-700 font-medium">The First Spark</Label>
            <Textarea
              id="firstSpark"
              value={formData.loveStory.firstSpark}
              onChange={(e) => setFormData({ 
                ...formData, 
                loveStory: { ...formData.loveStory, firstSpark: e.target.value }
              })}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="adventures" className="text-purple-700 font-medium">Adventures Together</Label>
            <Textarea
              id="adventures"
              value={formData.loveStory.adventures}
              onChange={(e) => setFormData({ 
                ...formData, 
                loveStory: { ...formData.loveStory, adventures: e.target.value }
              })}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="proposal" className="text-purple-700 font-medium">The Proposal</Label>
            <Textarea
              id="proposal"
              value={formData.loveStory.proposal}
              onChange={(e) => setFormData({ 
                ...formData, 
                loveStory: { ...formData.loveStory, proposal: e.target.value }
              })}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="nextChapter" className="text-purple-700 font-medium">Our Next Chapter</Label>
            <Textarea
              id="nextChapter"
              value={formData.loveStory.nextChapter}
              onChange={(e) => setFormData({ 
                ...formData, 
                loveStory: { ...formData.loveStory, nextChapter: e.target.value }
              })}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeManagement;
