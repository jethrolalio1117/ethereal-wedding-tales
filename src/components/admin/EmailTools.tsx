
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailTools: React.FC = () => {
  const [emailType, setEmailType] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<string>('');
  const [customEmail, setCustomEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [coupleNames, setCoupleNames] = useState('Liam & Mia');

  // Load couple names from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('homePageData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCoupleNames(parsedData.coupleNames || 'Liam & Mia');
      } catch (error) {
        console.error('Error parsing stored home data:', error);
      }
    }
  }, []);

  const emailTemplates = {
    reminder: {
      subject: `Gentle Reminder: Please RSVP for ${coupleNames}'s Wedding`,
      message: `Dear {name},

We hope this message finds you well! We're reaching out with a gentle reminder about our upcoming wedding celebration.

We would be absolutely delighted to have you join us on our special day, but we haven't received your RSVP yet. To help us with our planning, could you please let us know if you'll be able to attend?

You can RSVP easily through our wedding website: {website_url}

If you have any questions or need assistance, please don't hesitate to reach out to us directly.

With love and excitement,
${coupleNames} ✨`
    },
    thank_you: {
      subject: `Thank You for Your RSVP - ${coupleNames}`,
      message: `Dear {name},

Thank you so much for taking the time to RSVP to our wedding! We're thrilled that you'll be joining us on our special day.

We can't wait to celebrate with you and create beautiful memories together. If you have any questions as the date approaches, please feel free to reach out.

Looking forward to seeing you soon!

With love and gratitude,
${coupleNames} 💕`
    },
    save_the_date: {
      subject: `Save the Date: ${coupleNames}'s Wedding - October 25th, 2025`,
      message: `Dear {name},

We're excited to share some wonderful news with you! We're getting married and would love for you to be part of our special day.

Please save the date:
📅 Saturday, October 25th, 2025
🕒 3:00 PM Ceremony
📍 The Enchanted Gardens, 123 Dreamy Lane, Wonderland

A formal invitation with all the details will follow, but we wanted to give you plenty of time to mark your calendars.

We can't wait to celebrate with you!

With love,
${coupleNames} ✨`
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = emailTemplates[templateKey as keyof typeof emailTemplates];
    if (template) {
      setSubject(template.subject);
      setMessage(template.message);
    }
  };

  const sendEmail = async () => {
    if (!subject || !message || (!recipientType && !customEmail)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      console.log('Attempting to send email with:', { recipientType, subject: subject.substring(0, 50) });
      
      // Get recipient emails and names based on type
      let recipients: string[] = [];
      let guestNames: { [email: string]: string } = {};
      
      if (recipientType === 'custom') {
        recipients = [customEmail];
      } else {
        // Fetch guests from database based on recipient type
        let query = supabase.from('guests').select('email, name, attending');
        
        const { data: guests, error } = await query;
        
        if (error) {
          throw new Error(`Failed to fetch guests: ${error.message}`);
        }
        
        // Filter guests based on recipient type
        const filteredGuests = guests?.filter(guest => {
          if (!guest.email) return false;
          
          switch (recipientType) {
            case 'confirmed':
              return guest.attending === true;
            case 'declined':
              return guest.attending === false;
            case 'pending':
              return guest.attending === null || guest.attending === undefined;
            case 'all':
            default:
              return true;
          }
        }) || [];

        console.log('Filtered guests:', filteredGuests.map(g => ({ email: g.email, name: g.name, attending: g.attending })));
        
        recipients = filteredGuests.map(guest => guest.email);
        
        // Create guest names mapping
        filteredGuests.forEach(guest => {
          if (guest.email && guest.name) {
            guestNames[guest.email] = guest.name;
          }
        });
      }

      if (recipients.length === 0) {
        toast({
          title: "No Recipients",
          description: "No email addresses found for the selected recipient type.",
          variant: "destructive",
        });
        setSending(false);
        return;
      }

      console.log(`Sending to ${recipients.length} recipients with names:`, guestNames);

      // Call the edge function with updated parameters
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: recipients,
          subject,
          message,
          recipientType,
          coupleNames,
          websiteUrl: window.location.origin,
          guestNames
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Email sending response:', data);

      // Handle the response based on whether emails were actually sent
      if (data?.actualEmailsSent) {
        if (data.success) {
          toast({
            title: "Emails Sent Successfully!",
            description: `Your ${emailType || 'custom'} email has been sent to ${data.successCount} recipient(s).`,
          });
        } else {
          toast({
            title: "Partial Success",
            description: `${data.successCount} emails sent successfully, but ${data.errorCount} failed. Check the console for details.`,
            variant: "destructive",
          });
          if (data.errors) {
            console.error('Email sending errors:', data.errors);
          }
        }
      } else {
        toast({
          title: "Demo Mode - Emails Not Actually Sent",
          description: `This is a demo implementation. ${recipients.length} email(s) would be sent in production. To send real emails, you need to configure the Resend API key.`,
          variant: "destructive",
        });
      }

      // Reset form on success
      if (data?.success) {
        setEmailType('');
        setSubject('');
        setMessage('');
        setRecipientType('');
        setCustomEmail('');
      }
    } catch (error: any) {
      console.error('Email sending error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 shadow-lg relative overflow-hidden">
        {/* Floral decorations */}
        <div className="absolute top-2 right-2 text-pink-300 opacity-50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V9H21ZM9 6.5L3 7V9H9V6.5ZM12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM9 16.5L3 17V19H9V16.5ZM21 17L15 16.5V19H21V17Z"/>
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 text-purple-300 opacity-30">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>

        <div className="flex items-center mb-6">
          <Mail className="text-pink-600 mr-3" size={24} />
          <h3 className="text-xl font-playfair text-pink-800">Email Tools</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Composition */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailType">Email Template</Label>
              <Select
                value={emailType}
                onValueChange={(value) => {
                  setEmailType(value);
                  handleTemplateSelect(value);
                }}
              >
                <SelectTrigger className="border-pink-200 focus:border-pink-400">
                  <SelectValue placeholder="Choose a template or create custom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">RSVP Reminder</SelectItem>
                  <SelectItem value="thank_you">Thank You for RSVP</SelectItem>
                  <SelectItem value="save_the_date">Save the Date</SelectItem>
                  <SelectItem value="custom">Custom Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="border-pink-200 focus:border-pink-400"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="border-pink-200 focus:border-pink-400 min-h-[200px]"
              />
              <p className="text-xs text-pink-600 mt-1">
                Use {'{name}'} for personalization and {'{website_url}'} for your website link
              </p>
            </div>
          </div>

          {/* Recipients and Send */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Select
                value={recipientType}
                onValueChange={setRecipientType}
              >
                <SelectTrigger className="border-pink-200 focus:border-pink-400">
                  <SelectValue placeholder="Select recipient group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guests</SelectItem>
                  <SelectItem value="confirmed">Confirmed Attendees</SelectItem>
                  <SelectItem value="declined">Declined Guests</SelectItem>
                  <SelectItem value="pending">Pending RSVPs</SelectItem>
                  <SelectItem value="custom">Custom Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recipientType === 'custom' && (
              <div>
                <Label htmlFor="customEmail">Custom Email Address</Label>
                <Input
                  id="customEmail"
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
            )}

            <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
              <h4 className="font-medium text-pink-800 mb-2 flex items-center">
                <Users className="mr-2" size={16} />
                Email Preview
              </h4>
              <div className="text-sm space-y-2">
                <div><strong>From:</strong> {coupleNames} Wedding</div>
                <div><strong>To:</strong> {recipientType || 'Select recipients'}</div>
                <div><strong>Subject:</strong> {subject || 'Enter subject'}</div>
                <div className="bg-white rounded p-2 border">
                  <div className="text-xs text-gray-600 mb-1">Message Preview:</div>
                  <div className="text-sm">
                    {message ? message.substring(0, 150) + (message.length > 150 ? '...' : '') : 'Enter your message'}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={sendEmail}
              disabled={sending}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {sending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Send className="mr-2" size={18} />
                  Send Email
                </>
              )}
            </Button>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start">
                <CheckCircle className="text-green-600 mr-2 mt-0.5" size={16} />
                <div className="text-sm text-green-800">
                  <strong>Email Setup Complete:</strong> Your Resend API key is configured and emails will be sent to your guests.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTools;
