import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Balance {
  leave_type_label: string
  total_days: number
  used_days: number
  remaining_days: number
}

export const useBalances = () => {
  const [balances, setBalances] = useState<Balance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { data, error: fetchError } = await supabase
        .rpc('get_balances', { p_uid: user.id })

      if (fetchError) throw fetchError
      
      setBalances(data || [])
    } catch (err: any) {
      console.error('Error fetching balances:', err)
      setError(err.message || 'Erreur lors du chargement des soldes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalances()
  }, [])

  return {
    balances,
    loading,
    error,
    refetch: fetchBalances
  }
}