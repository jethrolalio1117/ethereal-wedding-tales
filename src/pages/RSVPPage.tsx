
import React, { useState } from 'react';
import { MailCheck, Send, User, Users, MessageSquare, Utensils, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useRSVPPageData } from '@/hooks/useRSVPPageData';

const RSVPPage: React.FC = () => {
  const { data: rsvpData } = useRSVPPageData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<string | undefined>(undefined);
  const [guests, setGuests] = useState<string>('1');
  const [dietary, setDietary] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !attending) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, and attendance status.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('guests')
        .insert({
          name,
          email,
          attending: attending === 'yes',
          guest_count: parseInt(guests),
          dietary_restrictions: dietary || null,
          message: message || null
        });

      if (error) throw error;

      toast({
        title: "RSVP Received!",
        description: "Thank you for your response. We can't wait to celebrate with you!",
      });

      // Reset form
      setName('');
      setEmail('');
      setAttending(undefined);
      setGuests('1');
      setDietary('');
      setMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 animate-fade-in-up opacity-0 relative min-h-screen" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      {/* Enhanced Background with Florals */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        {rsvpData.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${rsvpData.backgroundImage})` }}
          />
        )}
        {/* Floating Floral Elements */}
        <div className="absolute top-10 left-10 text-pink-300 opacity-20 animate-pulse">
          <Flower2 size={80} className="animate-bounce" />
        </div>
        <div className="absolute top-32 right-20 text-purple-300 opacity-15 animate-pulse delay-1000">
          <Flower2 size={60} className="animate-float" />
        </div>
        <div className="absolute bottom-32 left-16 text-pink-400 opacity-20 animate-pulse delay-2000">
          <Flower2 size={70} className="animate-bounce" />
        </div>
        <div className="absolute bottom-20 right-32 text-purple-400 opacity-25 animate-pulse delay-500">
          <Flower2 size={50} className="animate-float" />
        </div>
        {/* Scattered petals */}
        <div className="absolute top-1/4 left-1/3 text-pink-200 opacity-30 animate-spin-slow">
          <div className="w-4 h-4 bg-pink-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-1/2 right-1/4 text-purple-200 opacity-25 animate-spin-slow delay-1000">
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-pink-200 opacity-20 animate-spin-slow delay-2000">
          <div className="w-5 h-5 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-pink-200 relative z-10">
        <div className="text-center mb-10">
          <div className="relative">
            <MailCheck className="text-primary mx-auto mb-4 animate-pulse" size={64} strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 text-pink-300 opacity-60">
              <Flower2 size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair text-primary mb-2">{rsvpData.title}</h1>
          <p className="text-foreground/80 text-lg">{rsvpData.subtitle}</p>
          <p className="text-sm text-muted-foreground mt-1">{rsvpData.deadline}</p>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <Label htmlFor="name" className="text-lg flex items-center"><User size={18} className="mr-2 text-primary" /> Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="bg-background/50 border-border focus:border-primary"
            />
          </div>

          {/* Email Input */}
           <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Label htmlFor="email" className="text-lg flex items-center"><Send size={18} className="mr-2 text-primary" /> Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your.email@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="bg-background/50 border-border focus:border-primary"
            />
          </div>

          {/* Attending Radio Group */}
          <div className="space-y-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <Label className="text-lg">Will you be attending?</Label>
            <RadioGroup value={attending} onValueChange={setAttending} className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" className="text-primary border-primary focus:ring-primary checked:bg-primary" />
                <Label htmlFor="yes" className="font-normal text-foreground/90">Joyfully Accepts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="text-primary border-primary focus:ring-primary checked:bg-primary" />
                <Label htmlFor="no" className="font-normal text-foreground/90">Regretfully Declines</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Number of Guests (conditional) */}
          {attending === 'yes' && (
            <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Label htmlFor="guests" className="text-lg flex items-center"><Users size={18} className="mr-2 text-primary" /> Number of Guests (including yourself)</Label>
              <Input 
                id="guests" 
                type="number" 
                min="1" 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)} 
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
          )}

          {/* Dietary Restrictions (conditional) */}
          {attending === 'yes' && (
            <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Label htmlFor="dietary" className="text-lg flex items-center"><Utensils size={18} className="mr-2 text-primary" /> Dietary Restrictions or Allergies</Label>
              <Input 
                id="dietary" 
                type="text" 
                placeholder="e.g., vegetarian, gluten-free" 
                value={dietary} 
                onChange={(e) => setDietary(e.target.value)} 
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
          )}
          
          {/* Message Textarea */}
          <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <Label htmlFor="message" className="text-lg flex items-center"><MessageSquare size={18} className="mr-2 text-primary" /> Leave a Message (Optional)</Label>
            <Textarea 
              id="message" 
              placeholder="Any sweet wishes or notes for the couple?" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="bg-background/50 border-border focus:border-primary min-h-[100px]"
            />
          </div>
          
          {/* Submit Button */}
          <div className="text-center pt-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <Button 
              type="submit" 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto px-10 py-3 text-lg shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit RSVP'}
              {!isSubmitting && <Send size={20} className="ml-2" />}
            </Button>
          </div>
        </form>
         <p className="text-xs text-center text-muted-foreground mt-8">
          Your RSVP will be securely stored and managed through our admin dashboard.
        </p>
      </div>
    </div>
  );
};

export default RSVPPage;
