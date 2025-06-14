
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Users, Trash2, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean | null;
  guest_count: number;
  dietary_restrictions?: string;
  message?: string;
  created_at: string;
}

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    totalAttendees: 0
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGuests(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch guests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (guestData: Guest[]) => {
    const total = guestData.length;
    const confirmed = guestData.filter(g => g.attending === true).length;
    const declined = guestData.filter(g => g.attending === false).length;
    const pending = guestData.filter(g => g.attending === null).length;
    const totalAttendees = guestData
      .filter(g => g.attending === true)
      .reduce((sum, g) => sum + g.guest_count, 0);

    setStats({ total, confirmed, declined, pending, totalAttendees });
  };

  const deleteGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
      
      fetchGuests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
        <div className="text-center py-8">Loading guests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 text-center">
          <div className="text-2xl font-bold text-purple-800">{stats.total}</div>
          <div className="text-sm text-purple-600">Total RSVPs</div>
        </div>
        <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-800">{stats.confirmed}</div>
          <div className="text-sm text-green-600">Confirmed</div>
        </div>
        <div className="bg-red-50/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-800">{stats.declined}</div>
          <div className="text-sm text-red-600">Declined</div>
        </div>
        <div className="bg-yellow-50/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 text-center">
          <div className="text-2xl font-bold text-purple-800">{stats.totalAttendees}</div>
          <div className="text-sm text-purple-600">Total Attendees</div>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 overflow-hidden">
        <div className="p-6 border-b border-purple-100">
          <h3 className="text-xl font-playfair text-purple-800">Guest List</h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Dietary</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>
                  {guest.attending === true && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <UserCheck className="mr-1" size={12} />
                      Confirmed
                    </Badge>
                  )}
                  {guest.attending === false && (
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                      <UserX className="mr-1" size={12} />
                      Declined
                    </Badge>
                  )}
                  {guest.attending === null && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      <Users className="mr-1" size={12} />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{guest.guest_count}</TableCell>
                <TableCell className="max-w-32 truncate">
                  {guest.dietary_restrictions || '-'}
                </TableCell>
                <TableCell className="max-w-32">
                  {guest.message ? (
                    <div className="flex items-center text-purple-600">
                      <MessageSquare size={14} className="mr-1" />
                      <span className="truncate">{guest.message}</span>
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {new Date(guest.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteGuest(guest.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {guests.length === 0 && (
          <div className="text-center py-8 text-purple-600">
            No RSVPs received yet
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestManagement;
