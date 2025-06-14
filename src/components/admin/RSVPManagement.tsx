
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Save, Calendar, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRSVPPageData } from '@/hooks/useRSVPPageData';

const RSVPManagement: React.FC = () => {
  const { toast } = useToast();
  const { data, updateData } = useRSVPPageData();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(data);

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
            <Label htmlFor="rsvpBackground" className="text-purple-700">Background Image URL (optional)</Label>
            <Input
              id="rsvpBackground"
              value={formData.backgroundImage || ''}
              onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
              placeholder="Enter image URL for custom background"
              className="border-purple-200 focus:border-purple-400"
            />
            <p className="text-sm text-purple-600 mt-1">Leave empty to use the default floral background</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSVPManagement;
