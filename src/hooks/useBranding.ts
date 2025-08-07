import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface BrandingSettings {
  logo_url?: string | null
  header_text: string
  header_bg: string
  header_fg: string
  header_font_size: number
}

const defaultBranding: BrandingSettings = {
  logo_url: null,
  header_text: 'HRFlow – Gestion des congés',
  header_bg: '#ffffff',
  header_fg: '#111827',
  header_font_size: 20
}

export const useBranding = () => {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'branding')
          .single()

        if (error) {
          console.error('Error fetching branding:', error)
        } else if (data?.value) {
          setBranding({ ...defaultBranding, ...(data.value as unknown as BrandingSettings) })
        }
      } catch (error) {
        console.error('Error fetching branding:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBranding()
  }, [])

  const refetchBranding = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'branding')
        .single()

      if (error) {
        console.error('Error fetching branding:', error)
      } else if (data?.value) {
        setBranding({ ...defaultBranding, ...(data.value as unknown as BrandingSettings) })
      }
    } catch (error) {
      console.error('Error fetching branding:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    branding,
    loading,
    refetch: refetchBranding
  }
}