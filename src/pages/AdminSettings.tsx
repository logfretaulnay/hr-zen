import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useHolidays } from "@/hooks/useHolidays"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Plus, Edit, Trash2, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface LeaveType {
  id: string
  label: string
  color: string
  is_paid: boolean
  max_days_per_year?: number
  requires_approval: boolean
}

interface Holiday {
  id: string
  label: string
  date: string
  is_recurring: boolean
}

const AdminSettings = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(true)
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const { holidays, loading: loadingHolidays, error: holidaysError, refetch: refetchHolidays } = useHolidays()
  const { toast } = useToast()

  const fetchLeaveTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .order('label')

      if (error) throw error
      setLeaveTypes(data || [])
    } catch (error: any) {
      console.error('Error fetching leave types:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de congés",
        variant: "destructive",
      })
    }
  }


  const saveLeaveType = async (leaveType: Partial<LeaveType>) => {
    try {
      if (editingLeaveType) {
        const { error } = await supabase
          .from('leave_types')
          .update(leaveType)
          .eq('id', editingLeaveType.id)

        if (error) throw error
        toast({ title: "Type de congé modifié", description: "Les modifications ont été sauvegardées" })
      } else {
        const { error } = await supabase
          .from('leave_types')
          .insert([leaveType as any])

        if (error) throw error
        toast({ title: "Type de congé créé", description: "Le nouveau type a été ajouté" })
      }

      setEditingLeaveType(null)
      await fetchLeaveTypes()
    } catch (error: any) {
      console.error('Error saving leave type:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le type de congé",
        variant: "destructive",
      })
    }
  }

  const deleteLeaveType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast({ title: "Type de congé supprimé", description: "Le type a été supprimé avec succès" })
      await fetchLeaveTypes()
    } catch (error: any) {
      console.error('Error deleting leave type:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de congé",
        variant: "destructive",
      })
    }
  }

  const saveHoliday = async (holiday: Partial<Holiday>) => {
    try {
      if (editingHoliday) {
        const { error } = await supabase
          .from('holidays')
          .update(holiday)
          .eq('id', editingHoliday.id)

        if (error) throw error
        toast({ title: "Jour férié modifié", description: "Les modifications ont été sauvegardées" })
      } else {
        const { error } = await supabase
          .from('holidays')
          .insert([holiday as any])

        if (error) throw error
        toast({ title: "Jour férié créé", description: "Le nouveau jour férié a été ajouté" })
      }

      setEditingHoliday(null)
      await refetchHolidays()
    } catch (error: any) {
      console.error('Error saving holiday:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le jour férié",
        variant: "destructive",
      })
    }
  }

  const deleteHoliday = async (id: string) => {
    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast({ title: "Jour férié supprimé", description: "Le jour férié a été supprimé avec succès" })
      await refetchHolidays()
    } catch (error: any) {
      console.error('Error deleting holiday:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le jour férié",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchLeaveTypes()
      setLoadingLeaveTypes(false)
    }
    loadData()
  }, [])

  // Show error for holidays if there's one
  useEffect(() => {
    if (holidaysError) {
      toast({
        title: "Erreur",
        description: holidaysError,
        variant: "destructive",
      })
    }
  }, [holidaysError, toast])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Paramètres administrateur</h1>
            <p className="text-muted-foreground">Gérez les types de congés et jours fériés</p>
          </div>
        </div>

        <Tabs defaultValue="leave-types" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leave-types">Types de congés</TabsTrigger>
            <TabsTrigger value="holidays">Jours fériés</TabsTrigger>
          </TabsList>

          <TabsContent value="leave-types" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Types de congés</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingLeaveType(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau type
                  </Button>
                </DialogTrigger>
                <LeaveTypeDialog
                  leaveType={editingLeaveType}
                  onSave={saveLeaveType}
                  onCancel={() => setEditingLeaveType(null)}
                />
              </Dialog>
            </div>

            <div className="grid gap-4">
              {loadingLeaveTypes ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : leaveTypes.map((type) => (
                <Card key={type.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        <CardTitle className="text-lg">{type.label}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingLeaveType(type)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <LeaveTypeDialog
                            leaveType={type}
                            onSave={saveLeaveType}
                            onCancel={() => setEditingLeaveType(null)}
                          />
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteLeaveType(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant={type.is_paid ? "default" : "secondary"}>
                        {type.is_paid ? "Payé" : "Non payé"}
                      </Badge>
                      <Badge variant={type.requires_approval ? "outline" : "secondary"}>
                        {type.requires_approval ? "Validation requise" : "Validation automatique"}
                      </Badge>
                      {type.max_days_per_year && (
                        <Badge variant="outline">
                          Max: {type.max_days_per_year} jours/an
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="holidays" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Jours fériés</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingHoliday(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau jour férié
                  </Button>
                </DialogTrigger>
                <HolidayDialog
                  holiday={editingHoliday}
                  onSave={saveHoliday}
                  onCancel={() => setEditingHoliday(null)}
                />
              </Dialog>
            </div>

            <div className="grid gap-4">
              {loadingHolidays ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5" />
                        <div>
                          <Skeleton className="h-6 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : holidays.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Aucun jour férié configuré
                    </p>
                  </CardContent>
                </Card>
              ) : holidays.map((holiday) => (
                <Card key={holiday.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{holiday.label}</CardTitle>
                          <CardDescription>
                            {format(new Date(holiday.date), 'dd MMMM yyyy', { locale: fr })}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {holiday.is_recurring && (
                          <Badge>Récurrent</Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingHoliday(holiday)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <HolidayDialog
                            holiday={holiday}
                            onSave={saveHoliday}
                            onCancel={() => setEditingHoliday(null)}
                          />
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteHoliday(holiday.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

// Sous-composants pour les dialogs
const LeaveTypeDialog = ({ 
  leaveType, 
  onSave, 
  onCancel 
}: { 
  leaveType: LeaveType | null
  onSave: (data: Partial<LeaveType>) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    label: leaveType?.label || '',
    color: leaveType?.color || '#3B82F6',
    is_paid: leaveType?.is_paid ?? true,
    max_days_per_year: leaveType?.max_days_per_year || '',
    requires_approval: leaveType?.requires_approval ?? true,
  })

  const handleSubmit = () => {
    onSave({
      ...formData,
      max_days_per_year: formData.max_days_per_year ? Number(formData.max_days_per_year) : undefined
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {leaveType ? 'Modifier le type de congé' : 'Nouveau type de congé'}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Nom du type</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Ex: Congés payés"
          />
        </div>
        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="max_days">Jours maximum par an (optionnel)</Label>
          <Input
            id="max_days"
            type="number"
            value={formData.max_days_per_year}
            onChange={(e) => setFormData({ ...formData, max_days_per_year: e.target.value })}
            placeholder="25"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_paid"
            checked={formData.is_paid}
            onCheckedChange={(checked) => setFormData({ ...formData, is_paid: checked })}
          />
          <Label htmlFor="is_paid">Congés payés</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="requires_approval"
            checked={formData.requires_approval}
            onCheckedChange={(checked) => setFormData({ ...formData, requires_approval: checked })}
          />
          <Label htmlFor="requires_approval">Validation requise</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={handleSubmit}>Sauvegarder</Button>
      </DialogFooter>
    </DialogContent>
  )
}

const HolidayDialog = ({ 
  holiday, 
  onSave, 
  onCancel 
}: { 
  holiday: Holiday | null
  onSave: (data: Partial<Holiday>) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    label: holiday?.label || '',
    date: holiday?.date || '',
    is_recurring: holiday?.is_recurring ?? false,
  })

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {holiday ? 'Modifier le jour férié' : 'Nouveau jour férié'}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Nom du jour férié</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Ex: Noël"
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_recurring"
            checked={formData.is_recurring}
            onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
          />
          <Label htmlFor="is_recurring">Récurrent chaque année</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={handleSubmit}>Sauvegarder</Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default AdminSettings