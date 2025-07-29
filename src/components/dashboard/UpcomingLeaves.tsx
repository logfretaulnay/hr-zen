import { Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UpcomingLeave {
  id: string
  employeeName: string
  type: string
  startDate: string
  endDate: string
  avatar?: string
}

const mockUpcoming: UpcomingLeave[] = [
  {
    id: "1",
    employeeName: "Pierre Moreau",
    type: "Congés payés",
    startDate: "2024-12-16",
    endDate: "2024-12-20"
  },
  {
    id: "2",
    employeeName: "Julie Bernard",
    type: "RTT",
    startDate: "2024-12-18",
    endDate: "2024-12-18"
  },
  {
    id: "3",
    employeeName: "Marc Rousseau",
    type: "Formation",
    startDate: "2024-12-19",
    endDate: "2024-12-19"
  }
]

export function UpcomingLeaves() {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (start === end) {
      return startDate.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      })
    }
    
    return `${startDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    })} - ${endDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    })}`
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Congés à venir</CardTitle>
        <Button variant="outline" size="sm">
          Calendrier
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockUpcoming.map((leave) => (
          <div 
            key={leave.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">
                {getInitials(leave.employeeName)}
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm">{leave.employeeName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded text-xs">
                  {leave.type}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateRange(leave.startDate, leave.endDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {mockUpcoming.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun congé planifié</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}