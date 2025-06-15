
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRSVPPageData } from '@/hooks/useRSVPPageData';
import { useHomePageData } from '@/hooks/useHomePageData';
import { supabase } from '@/integrations/supabase/client';

const RSVPManagement: React.FC = () => {
  const { toast } = useToast();
  const { data, updateData } = useRSVPPageData();
  const { data: homeData } = useHomePageData();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(data);

  // Update formData when data changes and auto-fill couple names
  React.useEffect(() => {
    setFormData({
      ...data,
      coupleNames: homeData.coupleNames || data.coupleNames
    });
  }, [data, homeData.coupleNames]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `rsvp-bg-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      setFormData({ ...formData, backgroundImage: publicUrl });

      toast({
        title: "Background Image Uploaded",
        description: "RSVP background image has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      updateData(formData);
      
      toast({
        title: "RSVP Settings Saved",
        description: "RSVP page content has been updated successfully. Changes are now live!",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving RSVP page data:', error);
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
          <h2 className="text-2xl font-playfair text-purple-800">RSVP Page Management</h2>
          <p className="text-purple-600">Customize your RSVP page content and settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <MailCheck className="mr-2 h-5 w-5" />
            RSVP Page Content
          </CardTitle>
          <CardDescription>Customize the text and appearance of your RSVP page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rsvpTitle" className="text-purple-700">Page Title</Label>
            <Input
              id="rsvpTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Kindly RSVP"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          
          <div>
            <Label htmlFor="rsvpSubtitle" className="text-purple-700">Subtitle</Label>
            <Input
              id="rsvpSubtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g., We'd love for you to join us!"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="rsvpDeadline" className="text-purple-700">RSVP Deadline Text</Label>
            <Input
              id="rsvpDeadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              placeholder="e.g., Please respond by August 15th, 2025."
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="rsvpBackground" className="text-purple-700">Background Image</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="rsvpBackground"
                value={formData.backgroundImage || ''}
                onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                placeholder="Enter image URL or upload below"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="rsvpImageUpload" className="cursor-pointer">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-purple-400 mb-2" />
                  <p className="text-sm text-purple-600">
                    {isUploading ? 'Uploading...' : 'Click to upload RSVP background image'}
                  </p>
                </div>
                <input
                  id="rsvpImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={isUploading}
                />
              </Label>
            </div>
            <p className="text-sm text-purple-600 mt-1">Leave empty to use the default floral background</p>
          </div>

          <div>
            <Label htmlFor="coupleNames" className="text-purple-700">Couple Names (auto-filled from home page)</Label>
            <Input
              id="coupleNames"
              value={formData.coupleNames || homeData.coupleNames}
              onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
              placeholder="e.g., John & Jane"
              className="border-purple-200 focus:border-purple-400 bg-gray-50"
            />
            <p className="text-sm text-purple-600 mt-1">This is automatically filled from the home page couple names</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSVPManagement;
