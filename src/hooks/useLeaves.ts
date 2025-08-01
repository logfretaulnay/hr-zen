import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthContext';
import { useToast } from './use-toast';

export interface LeaveBalance {
  leave_type_label: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
}

export interface LeaveRequestWithDetails {
  id: string;
  user_id: string;
  type_id: string;
  start_date: string;
  end_date: string;
  half_day_start: boolean;
  half_day_end: boolean;
  total_days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason?: string;
  manager_comment?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  leave_types?: {
    id: string;
    label: string;
    color: string;
  } | null;
  profiles?: {
    name: string;
    email: string;
  } | null;
}

export const useLeaves = () => {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isManager, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchBalances = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', new Date().getFullYear());

      if (error) throw error;
      
      // Simulation des données de balance
      const mockBalances: LeaveBalance[] = [
        { leave_type_label: 'Congés payés', total_days: 25, used_days: 6.5, remaining_days: 18.5 },
        { leave_type_label: 'RTT', total_days: 10, used_days: 3, remaining_days: 7 },
        { leave_type_label: 'Congés maladie', total_days: 10, used_days: 1, remaining_days: 9 }
      ];
      
      setBalances(mockBalances);
    } catch (error: any) {
      console.error('Error fetching balances:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les soldes",
        variant: "destructive",
      });
    }
  };

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Si l'utilisateur n'est pas manager/admin, ne montrer que ses demandes
      if (!isManager && !isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests((data || []) as LeaveRequestWithDetails[]);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string, comment?: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'APPROVED',
          manager_comment: comment,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
      toast({
        title: "Demande approuvée",
        description: "La demande a été approuvée avec succès",
      });
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la demande",
        variant: "destructive",
      });
    }
  };

  const rejectRequest = async (requestId: string, comment?: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'REJECTED',
          manager_comment: comment,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
      toast({
        title: "Demande refusée",
        description: "La demande a été refusée",
      });
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la demande",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalances();
      fetchRequests();
    }
  }, [user, isManager, isAdmin]);

  return {
    balances,
    requests,
    loading,
    fetchBalances,
    fetchRequests,
    approveRequest,
    rejectRequest,
  };
};