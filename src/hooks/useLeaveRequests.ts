import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LeaveRequest {
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

export interface LeaveType {
  id: string;
  label: string;
  color: string;
  is_paid: boolean;
  max_days_per_year?: number;
  requires_approval: boolean;
}

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchLeaveTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .order('label');

      if (error) throw error;
      setLeaveTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching leave types:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de congés",
        variant: "destructive",
      });
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is not manager/admin, only show their own requests
      if (profile?.role === 'EMPLOYEE') {
        query = query.eq('user_id', profile.user_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
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

  const createRequest = async (requestData: {
    type_id: string;
    start_date: string;
    end_date: string;
    half_day_start: boolean;
    half_day_end: boolean;
    total_days: number;
    reason?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{
          ...requestData,
          user_id: profile?.user_id,
        }])
        .select('*')
        .single();

      if (error) throw error;

      setRequests(prev => [data, ...prev]);
      
      // Send notification email to managers
      await supabase.functions.invoke('send-notification-email', {
        body: {
          to: 'manager@company.com', // In production, get manager emails from DB
          subject: 'Nouvelle demande de congés',
          content: `Une nouvelle demande de congés a été soumise par ${profile?.name}`,
          leaveRequestId: data.id
        }
      });

      toast({
        title: "Demande créée",
        description: "Votre demande a été soumise avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateRequestStatus = async (
    requestId: string, 
    status: 'APPROVED' | 'REJECTED',
    managerComment?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({
          status,
          manager_comment: managerComment,
          approved_by: profile?.user_id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select('*')
        .single();

      if (error) throw error;

      setRequests(prev => 
        prev.map(req => req.id === requestId ? data : req)
      );

      // Send notification to employee
      await supabase.functions.invoke('send-notification-email', {
        body: {
          to: 'employee@company.com', // In production, get employee email from profiles
          subject: `Demande de congés ${status === 'APPROVED' ? 'approuvée' : 'refusée'}`,
          content: `Votre demande de congés a été ${status === 'APPROVED' ? 'approuvée' : 'refusée'}`,
        }
      });

      toast({
        title: "Demande mise à jour",
        description: `La demande a été ${status === 'APPROVED' ? 'approuvée' : 'refusée'}`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la demande",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (profile) {
      fetchRequests();
      fetchLeaveTypes();
    }
  }, [profile]);

  return {
    requests,
    leaveTypes,
    loading,
    fetchRequests,
    createRequest,
    updateRequestStatus,
  };
};