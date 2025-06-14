
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Heart, Image, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HomeManagement: React.FC = () => {
  const { toast } = useToast();

  // Default values from the current home page
  const [backgroundImage, setBackgroundImage] = useState("https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80");
  const [coupleNames, setCoupleNames] = useState("Liam & Mia");
  const [weddingDate, setWeddingDate] = useState("October 25th, 2025");
  const [ceremonyTime, setCeremonyTime] = useState("3:00 PM");
  const [venueName, setVenueName] = useState("The Enchanted Gardens");
  const [venueAddress, setVenueAddress] = useState("123 Dreamy Lane, Wonderland");
  
  // Love story sections
  const [firstSpark, setFirstSpark] = useState("It all began on a crisp autumn evening, under a sky full of stars. We met at a small, cozy bookstore cafe, drawn together by a shared love for classic literature and strong coffee. What started as a simple conversation about our favorite authors soon blossomed into something much more profound. We talked for hours, lost in our own world, oblivious to the time passing by.");
  const [adventures, setAdventures] = useState("From that day forward, our lives became an exciting adventure. We explored hidden city gems, hiked through breathtaking landscapes, and shared countless laugh-filled dinners. Each moment, whether big or small, wove another thread into the beautiful tapestry of our relationship. We discovered not just a partner in each other, but a best friend, a confidant, and a soulmate.");
  const [proposal, setProposal] = useState("On a serene beach, with the sun setting in a blaze of glory, painting the sky in hues of orange and purple, one of us got down on one knee. It was a moment suspended in time, filled with happy tears, heartfelt promises, and an overwhelming sense of joy. The answer was a resounding \"Yes!\" – a promise of forever.");
  const [nextChapter, setNextChapter] = useState("Now, we stand on the cusp of our greatest adventure yet – marriage. We are so excited to celebrate our love with all of you, our cherished family and friends. Your presence will make our special day even more memorable as we embark on this beautiful journey together, hand in hand, heart to heart.");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Store the data in localStorage for now (could be upgraded to database later)
      const homePageData = {
        backgroundImage,
        coupleNames,
        weddingDate,
        ceremonyTime,
        venueName,
        venueAddress,
        loveStory: {
          firstSpark,
          adventures,
          proposal,
          nextChapter
        },
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('homePageData', JSON.stringify(homePageData));
      
      toast({
        title: "Settings Saved",
        description: "Home page content has been updated successfully. Refresh the page to see changes.",
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
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              placeholder="Enter image URL"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="coupleNames" className="text-purple-700">Couple Names</Label>
            <Input
              id="coupleNames"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
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
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                placeholder="e.g., October 25th, 2025"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="ceremonyTime" className="text-purple-700">Ceremony Time</Label>
              <Input
                id="ceremonyTime"
                value={ceremonyTime}
                onChange={(e) => setCeremonyTime(e.target.value)}
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
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g., The Enchanted Gardens"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="venueAddress" className="text-purple-700">Venue Address</Label>
              <Input
                id="venueAddress"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
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
              value={firstSpark}
              onChange={(e) => setFirstSpark(e.target.value)}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="adventures" className="text-purple-700 font-medium">Adventures Together</Label>
            <Textarea
              id="adventures"
              value={adventures}
              onChange={(e) => setAdventures(e.target.value)}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="proposal" className="text-purple-700 font-medium">The Proposal</Label>
            <Textarea
              id="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={4}
              className="border-purple-200 focus:border-purple-400 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="nextChapter" className="text-purple-700 font-medium">Our Next Chapter</Label>
            <Textarea
              id="nextChapter"
              value={nextChapter}
              onChange={(e) => setNextChapter(e.target.value)}
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
