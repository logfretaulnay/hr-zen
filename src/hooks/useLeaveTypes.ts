import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface LeaveType {
  id: string
  label: string
  color: string
  is_paid: boolean
  requires_approval: boolean
  max_days_per_year?: number
  created_at: string
}

export const useLeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('leave_types')
        .select('*')
        .order('label')

      if (fetchError) throw fetchError
      
      setLeaveTypes(data || [])
    } catch (err: any) {
      console.error('Error fetching leave types:', err)
      setError(err.message || 'Erreur lors du chargement des types de congés')
    } finally {
      setLoading(false)
    }
  }

  const createLeaveType = async (leaveType: Omit<LeaveType, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('leave_types')
        .insert([leaveType])

      if (error) throw error

      toast({
        title: "Type de congé créé",
        description: "Le nouveau type de congé a été ajouté avec succès"
      })
      
      await fetchLeaveTypes()
      return { success: true }
    } catch (error: any) {
      console.error('Error creating leave type:', error)
      toast({
        title: "Erreur",
        description: "Impossible de créer le type de congé",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  const updateLeaveType = async (id: string, updates: Partial<LeaveType>) => {
    try {
      const { error } = await supabase
        .from('leave_types')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Type de congé mis à jour",
        description: "Les modifications ont été sauvegardées"
      })
      
      await fetchLeaveTypes()
      return { success: true }
    } catch (error: any) {
      console.error('Error updating leave type:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le type de congé",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  const deleteLeaveType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_types')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Type de congé supprimé",
        description: "Le type de congé a été supprimé avec succès"
      })
      
      await fetchLeaveTypes()
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting leave type:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de congé",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  return {
    leaveTypes,
    loading,
    error,
    refetch: fetchLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
  }
}