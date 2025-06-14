import React, { useState } from 'react';
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

  const emailTemplates = {
    reminder: {
      subject: 'Gentle Reminder: Please RSVP for Liam & Mia\'s Wedding',
      message: `Dear {name},

We hope this message finds you well! We're reaching out with a gentle reminder about our upcoming wedding celebration.

We would be absolutely delighted to have you join us on our special day, but we haven't received your RSVP yet. To help us with our planning, could you please let us know if you'll be able to attend?

You can RSVP easily through our wedding website: {website_url}

If you have any questions or need assistance, please don't hesitate to reach out to us directly.

With love and excitement,
Liam & Mia ✨`
    },
    thank_you: {
      subject: 'Thank You for Your RSVP - Liam & Mia',
      message: `Dear {name},

Thank you so much for taking the time to RSVP to our wedding! We're thrilled that you'll be joining us on our special day.

We can't wait to celebrate with you and create beautiful memories together. If you have any questions as the date approaches, please feel free to reach out.

Looking forward to seeing you soon!

With love and gratitude,
Liam & Mia 💕`
    },
    save_the_date: {
      subject: 'Save the Date: Liam & Mia\'s Wedding - October 25th, 2025',
      message: `Dear {name},

We're excited to share some wonderful news with you! We're getting married and would love for you to be part of our special day.

Please save the date:
📅 Saturday, October 25th, 2025
🕒 3:00 PM Ceremony
📍 The Enchanted Gardens, 123 Dreamy Lane, Wonderland

A formal invitation with all the details will follow, but we wanted to give you plenty of time to mark your calendars.

We can't wait to celebrate with you!

With love,
Liam & Mia ✨`
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
      
      // Get recipient emails based on type
      let recipients = [];
      
      if (recipientType === 'custom') {
        recipients = [customEmail];
      } else {
        // Fetch guests from database based on recipient type
        let query = supabase.from('guests').select('email, name');
        
        switch (recipientType) {
          case 'confirmed':
            query = query.eq('attending', true);
            break;
          case 'declined':
            query = query.eq('attending', false);
            break;
          case 'pending':
            query = query.is('attending', null);
            break;
          case 'all':
          default:
            // No filter for all guests
            break;
        }
        
        const { data: guests, error } = await query;
        
        if (error) {
          throw new Error(`Failed to fetch guests: ${error.message}`);
        }
        
        recipients = guests?.map(guest => guest.email).filter(email => email) || [];
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

      console.log(`Sending to ${recipients.length} recipients`);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: recipients,
          subject,
          message,
          recipientType
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center mb-6">
          <Mail className="text-purple-600 mr-3" size={24} />
          <h3 className="text-xl font-playfair text-purple-800">Email Tools</h3>
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
                <SelectTrigger className="border-purple-200">
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
                className="border-purple-200"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="border-purple-200 min-h-[200px]"
              />
              <p className="text-xs text-purple-600 mt-1">
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
                <SelectTrigger className="border-purple-200">
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
                  className="border-purple-200"
                />
              </div>
            )}

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                <Users className="mr-2" size={16} />
                Email Preview
              </h4>
              <div className="text-sm space-y-2">
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
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
