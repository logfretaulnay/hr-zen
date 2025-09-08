import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useUsers } from "@/contexts/UsersContext"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"

const NewUser = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { refetch } = useUsers()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    department: '',
    jobTitle: '',
    phone: '',
    startDate: '',
    annualLeave: 25,
    rttDays: 10
  })

  const roles = [
    { value: "employee", label: "Employé" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Administrateur" }
  ]

  const departments = [
    { value: "dev", label: "Développement" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Commercial" },
    { value: "hr", label: "Ressources Humaines" },
    { value: "finance", label: "Finance" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      // Créer l'utilisateur dans Supabase Auth avec admin
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          name: `${formData.firstName} ${formData.lastName}`,
          role: formData.role.toUpperCase()
        }
      })

      if (authError) {
        console.error('Auth creation error:', authError)
        toast({
          title: "Erreur",
          description: `Impossible de créer le compte utilisateur: ${authError.message}`,
          variant: "destructive",
        })
        return
      }

      if (!authData.user) {
        throw new Error('Aucun utilisateur créé')
      }

      // Créer le profil dans la table profiles
      const roleMapping: Record<string, 'EMPLOYEE' | 'MANAGER' | 'ADMIN'> = {
        'employee': 'EMPLOYEE',
        'manager': 'MANAGER', 
        'admin': 'ADMIN'
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          role: roleMapping[formData.role] || 'EMPLOYEE',
          department: departments.find(d => d.value === formData.department)?.label || formData.department,
          job_title: formData.jobTitle,
          phone: formData.phone,
          start_date: formData.startDate,
          annual_leave_days: formData.annualLeave,
          rtt_days: formData.rttDays
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        toast({
          title: "Erreur",
          description: `Impossible de créer le profil utilisateur: ${profileError.message}`,
          variant: "destructive",
        })
        return
      }

      // Rafraîchir la liste des utilisateurs
      await refetch()
      
      toast({
        title: "Utilisateur créé",
        description: "Le nouvel utilisateur a été ajouté avec succès",
      })
      
      navigate("/admin/users")
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/admin/users")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nouvel utilisateur</h1>
              <p className="text-muted-foreground">Ajouter un nouveau membre à l'équipe</p>
            </div>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="jean.dupont@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe temporaire</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Intitulé du poste</Label>
                <Input 
                  id="jobTitle"
                  placeholder="Développeur Full Stack"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Date d'embauche</Label>
                <Input 
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualLeave">Congés payés annuels (jours)</Label>
                  <Input 
                    id="annualLeave"
                    type="number"
                    placeholder="25"
                    value={formData.annualLeave}
                    onChange={(e) => setFormData(prev => ({ ...prev, annualLeave: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rttDays">RTT annuels (jours)</Label>
                  <Input 
                    id="rttDays"
                    type="number"
                    placeholder="10"
                    value={formData.rttDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, rttDays: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="gap-2" disabled={loading}>
                  <Save className="h-4 w-4" />
                  {loading ? "Création en cours..." : "Créer l'utilisateur"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/admin/users")}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default NewUser