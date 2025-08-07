import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface EditUserModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

interface UserProfile {
  id: string
  name: string
  email: string
  department?: string
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN'
  phone?: string
  job_title?: string
}

export const EditUserModal = ({ userId, isOpen, onClose }: EditUserModalProps) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    department: string
    role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN'
    phone: string
    job_title: string
    active: boolean
  }>({
    name: '',
    email: '',
    department: '',
    role: 'EMPLOYEE',
    phone: '',
    job_title: '',
    active: true
  })
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && userId) {
      fetchUser()
    }
  }, [isOpen, userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, department, role, phone, job_title')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      setUser({ ...data, id: userId })
      setFormData({
        name: data.name || '',
        email: data.email || '',
        department: data.department || '',
        role: data.role || 'EMPLOYEE',
        phone: data.phone || '',
        job_title: data.job_title || '',
        active: true
      })
    } catch (error: any) {
      console.error('Error fetching user:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données utilisateur",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          department: formData.department,
          role: formData.role,
          phone: formData.phone,
          job_title: formData.job_title
        })
        .eq('user_id', userId)

      if (profileError) throw profileError

      // If role changed, update user metadata
      if (user && user.role !== formData.role) {
        const { error: metadataError } = await supabase.auth.admin.updateUserById(
          userId,
          { user_metadata: { role: formData.role } }
        )
        
        if (metadataError) {
          console.warn('Could not update user metadata:', metadataError)
        }
      }

      toast({
        title: "Utilisateur mis à jour",
        description: "Les modifications ont été sauvegardées avec succès"
      })
      onClose()
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom complet"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Département"
              />
            </div>

            <div>
              <Label htmlFor="job_title">Poste</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Intitulé du poste"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => 
                  setFormData({ ...formData, role: value as 'EMPLOYEE' | 'MANAGER' | 'ADMIN' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employé</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Compte actif</Label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}