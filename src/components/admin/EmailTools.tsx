
import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, UserCheck, UserX, AlertCircle, Heart, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Guest {
  id: string;
  name: string;
  email: string;
  attending?: boolean;
  guest_count?: number;
}

const EmailTools: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recipientType, setRecipientType] = useState<string>('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [coupleNames, setCoupleNames] = useState('Wedding Couple');
  const { toast } = useToast();

  useEffect(() => {
    fetchGuests();
    extractCoupleNames();
  }, []);

  const extractCoupleNames = () => {
    // Try to get couple names from the hero section
    try {
      const heroElement = document.querySelector('h1');
      if (heroElement && heroElement.textContent) {
        const heroText = heroElement.textContent.trim();
        if (heroText.includes('&') || heroText.includes('and')) {
          setCoupleNames(heroText);
        }
      }
    } catch (error) {
      console.log('Could not extract couple names from hero section');
    }
  };

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name');

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGuests = (): Guest[] => {
    switch (recipientType) {
      case 'confirmed':
        return guests.filter(guest => guest.attending === true);
      case 'declined':
        return guests.filter(guest => guest.attending === false);
      case 'pending':
        return guests.filter(guest => guest.attending === null || guest.attending === undefined);
      default:
        return guests;
    }
  };

  const handleSendEmails = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }

    const recipientGuests = getFilteredGuests();
    
    if (recipientGuests.length === 0) {
      toast({
        title: "No recipients",
        description: "No guests match the selected criteria",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // Prepare recipient emails and names
      const recipientEmails = recipientGuests.map(guest => guest.email);
      const guestNames = recipientGuests.reduce((acc, guest) => {
        acc[guest.email] = guest.name;
        return acc;
      }, {} as { [email: string]: string });

      const websiteUrl = window.location.origin;

      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: recipientEmails,
          subject,
          message,
          recipientType,
          coupleNames,
          websiteUrl,
          guestNames,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const result = response.data;
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        
        // Clear form
        setSubject('');
        setMessage('');
      } else {
        toast({
          title: "Partial Success",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getRecipientTypeLabel = (type: string): string => {
    switch (type) {
      case 'confirmed': return 'Confirmed Guests';
      case 'declined': return 'Declined Guests';
      case 'pending': return 'Pending RSVPs';
      default: return 'All Guests';
    }
  };

  const filteredGuests = getFilteredGuests();

  if (loading) {
    return (
      <div className="text-center py-8">
        <Mail className="text-primary mx-auto mb-4 animate-pulse" size={48} />
        <p className="text-purple-600">Loading email tools...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Floating floral decorations */}
      <div className="absolute top-0 right-0 text-pink-200 opacity-20 animate-pulse">
        <Flower2 size={60} />
      </div>
      <div className="absolute bottom-0 left-0 text-purple-200 opacity-15 animate-bounce">
        <Heart size={40} />
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200">
          <CardTitle className="flex items-center gap-2 text-pink-800 font-playfair">
            <Mail className="text-pink-600" />
            Email Communication Center
          </CardTitle>
          <p className="text-sm text-purple-600">Send personalized emails to your wedding guests</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Guest Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <Users className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="text-lg font-semibold text-blue-800">{guests.length}</div>
              <div className="text-xs text-blue-600">Total Guests</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <UserCheck className="mx-auto mb-2 text-green-600" size={24} />
              <div className="text-lg font-semibold text-green-800">
                {guests.filter(g => g.attending === true).length}
              </div>
              <div className="text-xs text-green-600">Confirmed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <UserX className="mx-auto mb-2 text-red-600" size={24} />
              <div className="text-lg font-semibold text-red-800">
                {guests.filter(g => g.attending === false).length}
              </div>
              <div className="text-xs text-red-600">Declined</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <AlertCircle className="mx-auto mb-2 text-yellow-600" size={24} />
              <div className="text-lg font-semibold text-yellow-800">
                {guests.filter(g => g.attending === null || g.attending === undefined).length}
              </div>
              <div className="text-xs text-yellow-600">Pending</div>
            </div>
          </div>

          <Separator className="bg-pink-200" />

          {/* Email Composition */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Couple Names (for email personalization)
              </label>
              <Input
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
                placeholder="e.g., John & Jane"
                className="border-pink-300 focus:border-pink-500 focus:ring-pink-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Send to
              </label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger className="border-pink-300 focus:border-pink-500 focus:ring-pink-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guests ({guests.length})</SelectItem>
                  <SelectItem value="confirmed">
                    Confirmed Guests ({guests.filter(g => g.attending === true).length})
                  </SelectItem>
                  <SelectItem value="declined">
                    Declined Guests ({guests.filter(g => g.attending === false).length})
                  </SelectItem>
                  <SelectItem value="pending">
                    Pending RSVPs ({guests.filter(g => g.attending === null || g.attending === undefined).length})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipients Preview */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {getRecipientTypeLabel(recipientType)}
                </Badge>
                <span className="text-sm text-purple-600">
                  {filteredGuests.length} recipient{filteredGuests.length !== 1 ? 's' : ''}
                </span>
              </div>
              {filteredGuests.length > 0 && (
                <div className="text-xs text-purple-600 max-h-20 overflow-y-auto">
                  {filteredGuests.map(guest => guest.name).join(', ')}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Subject
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="border-pink-300 focus:border-pink-500 focus:ring-pink-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here. Use {name} to personalize with guest names and {website_url} for your website link."
                className="border-pink-300 focus:border-pink-500 focus:ring-pink-200 min-h-[120px]"
              />
              <div className="text-xs text-purple-600 mt-1">
                <strong>Personalization tips:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Use <code className="bg-purple-100 px-1 rounded">{'{name}'}</code> to insert the guest's name</li>
                  <li>Use <code className="bg-purple-100 px-1 rounded">{'{website_url}'}</code> to insert your website link</li>
                  <li>Couple names will automatically replace any mentions of "Liam & Mia"</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleSendEmails}
              disabled={sending || !subject.trim() || !message.trim() || filteredGuests.length === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
            >
              {sending ? (
                <>
                  <Send className="mr-2 animate-spin" size={18} />
                  Sending to {filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={18} />
                  Send Email to {filteredGuests.length} Guest{filteredGuests.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTools;
