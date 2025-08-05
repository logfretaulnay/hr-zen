import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Holiday {
  id: string
  label: string
  date: string
  is_recurring: boolean
}

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHolidays = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('holidays')
        .select('*')
        .order('date')

      if (fetchError) throw fetchError
      
      setHolidays(data || [])
    } catch (err: any) {
      console.error('Error fetching holidays:', err)
      setError(err.message || 'Erreur lors du chargement des jours fériés')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHolidays()
  }, [])

  return {
    holidays,
    loading,
    error,
    refetch: fetchHolidays
  }
}