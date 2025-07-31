import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar as CalendarIcon, Save } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useLeaveRequests } from "@/hooks/useLeaveRequests"

const NewRequest = () => {
  const navigate = useNavigate()
  const { leaveTypes, createRequest } = useLeaveRequests()
  
  const [selectedType, setSelectedType] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [halfDayStart, setHalfDayStart] = useState(false)
  const [halfDayEnd, setHalfDayEnd] = useState(false)
  const [reason, setReason] = useState("")
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    let days = differenceInDays(endDate, startDate) + 1;
    if (halfDayStart) days -= 0.5;
    if (halfDayEnd) days -= 0.5;
    return Math.max(0, days);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedType || !startDate || !endDate) {
      return;
    }

    setIsSubmitting(true);
    
    const requestData = {
      type_id: selectedType,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      half_day_start: halfDayStart,
      half_day_end: halfDayEnd,
      total_days: calculateTotalDays(),
      reason: reason || undefined,
    };

    const { error } = await createRequest(requestData);
    
    if (!error) {
      navigate("/requests");
    }
    
    setIsSubmitting(false);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/requests")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nouvelle demande de congé</h1>
            <p className="text-muted-foreground">Créer une nouvelle demande d'absence</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informations de la demande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="leave-type">Type de congé</Label>
                <Select value={selectedType} onValueChange={setSelectedType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de congé" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date)
                          setIsStartDateOpen(false)
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date)
                          setIsEndDateOpen(false)
                        }}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="half-day-start" 
                  checked={halfDayStart}
                  onCheckedChange={(checked) => setHalfDayStart(checked === true)}
                />
                <Label htmlFor="half-day-start">Demi-journée de début</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="half-day-end" 
                  checked={halfDayEnd}
                  onCheckedChange={(checked) => setHalfDayEnd(checked === true)}
                />
                <Label htmlFor="half-day-end">Demi-journée de fin</Label>
              </div>

              {(startDate && endDate) && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Durée totale:</strong> {calculateTotalDays()} jour(s)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="comment">Commentaire (optionnel)</Label>
                <Textarea 
                  id="comment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Motif ou informations complémentaires..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="gap-2" 
                  disabled={isSubmitting || !selectedType || !startDate || !endDate}
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Envoi..." : "Soumettre la demande"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/requests")}
                  disabled={isSubmitting}
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

export default NewRequest