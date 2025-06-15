
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, Users, UserCheck, UserX, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useHomePageData } from '@/hooks/useHomePageData';

interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  guest_count: number;
}

const EmailTools: React.FC = () => {
  const { toast } = useToast();
  const { data: homeData } = useHomePageData();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recipientType, setRecipientType] = useState<string>('all');
  const [subject, setSubject] = useState('Important Update About Our Wedding!');
  const [message, setMessage] = useState(`Dear {name},

We hope this message finds you well! We wanted to reach out with some important updates regarding our upcoming wedding celebration.

We're so excited to celebrate this special day with you and can't wait to see you there! If you have any questions or need any additional information, please don't hesitate to reach out to us.

You can visit our wedding website for the latest updates and information: {website_url}

With love and excitement,
${homeData.coupleNames || 'The Happy Couple'}`);

  useEffect(() => {
    fetchGuests();
  }, []);

  // Update message when homeData changes
  useEffect(() => {
    if (homeData.coupleNames) {
      setMessage(prev => prev.replace(/The Happy Couple$/, homeData.coupleNames));
    }
  }, [homeData.coupleNames]);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to load guest list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecipients = () => {
    switch (recipientType) {
      case 'confirmed':
        return guests.filter(guest => guest.attending);
      case 'declined':
        return guests.filter(guest => !guest.attending);
      default:
        return guests;
    }
  };

  const sendEmails = async () => {
    const recipients = getRecipients();
    
    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "No guests found for the selected recipient type.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide both subject and message.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const recipientEmails = recipients.map(guest => guest.email);
      const guestNames = recipients.reduce((acc, guest) => {
        acc[guest.email] = guest.name;
        return acc;
      }, {} as { [email: string]: string });

      console.log('Sending to recipients:', recipientEmails);
      console.log('With guest names:', guestNames);

      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: recipientEmails,
          subject,
          message,
          recipientType,
          coupleNames: homeData.coupleNames || 'Wedding Couple',
          websiteUrl: window.location.origin,
          guestNames
        }
      });

      if (response.error) {
        throw response.error;
      }

      const result = response.data;
      
      if (result.success) {
        toast({
          title: "Emails Sent Successfully!",
          description: result.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Partial Success",
          description: result.message,
          variant: "destructive",
          duration: 7000,
        });
      }

    } catch (error: any) {
      console.error('Error sending emails:', error);
      toast({
        title: "Failed to Send Emails",
        description: error.message || "There was an error sending the emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const recipients = getRecipients();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair text-purple-800">Email Communication</h2>
        <p className="text-purple-600">Send updates and messages to your guests</p>
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Send className="mr-2 h-5 w-5" />
            Send Email to Guests
          </CardTitle>
          <CardDescription>Compose and send emails to your wedding guests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-purple-700 font-medium">Select Recipients</Label>
            <RadioGroup value={recipientType} onValueChange={setRecipientType} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  All Guests ({guests.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confirmed" id="confirmed" />
                <Label htmlFor="confirmed" className="flex items-center">
                  <UserCheck className="mr-1 h-4 w-4" />
                  Confirmed Attendees ({guests.filter(g => g.attending).length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="declined" id="declined" />
                <Label htmlFor="declined" className="flex items-center">
                  <UserX className="mr-1 h-4 w-4" />
                  Declined ({guests.filter(g => !g.attending).length})
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="subject" className="text-purple-700">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-purple-700">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={10}
              className="border-purple-200 focus:border-purple-400"
            />
            <p className="text-sm text-purple-600 mt-1">
              Use {"{name}"} to personalize with guest names and {"{website_url}"} for your website link
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Email Preview</h4>
            <p className="text-sm text-purple-700">
              Sending to <strong>{recipients.length}</strong> recipient(s)
            </p>
            <p className="text-sm text-purple-600 mt-1">
              From: {homeData.coupleNames || 'Wedding Couple'}
            </p>
          </div>

          <Button 
            onClick={sendEmails} 
            disabled={sending || recipients.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Emails...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email to {recipients.length} Recipient(s)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTools;
