import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface LeaveRequest {
  id: string
  user_id: string
  type_id: string
  start_date: string
  end_date: string
  total_days: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  reason?: string
  created_at: string
  profiles: {
    name: string
    email: string
  }
  leave_types: {
    label: string
    color: string
  }
}

export const useTeamRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('leave_requests')
        .select(`
          *,
          profiles:user_id (name, email),
          leave_types:type_id (label, color)
        `)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      setRequests((data as any) || [])
    } catch (err: any) {
      console.error('Error fetching team requests:', err)
      setError(err.message || 'Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  const approveRequest = async (requestId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: 'APPROVED',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error
      
      await fetchRequests() // Refresh data
      return { success: true }
    } catch (error: any) {
      console.error('Error approving request:', error)
      return { success: false, error: error.message }
    }
  }

  const rejectRequest = async (requestId: string, comment?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: 'REJECTED',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          manager_comment: comment
        })
        .eq('id', requestId)

      if (error) throw error
      
      await fetchRequests() // Refresh data
      return { success: true }
    } catch (error: any) {
      console.error('Error rejecting request:', error)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    approveRequest,
    rejectRequest
  }
}