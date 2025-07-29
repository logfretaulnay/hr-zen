import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Users } from "lucide-react"

const Calendar = () => {
  const mockEvents = [
    {
      id: 1,
      user: "Marie Dupont",
      type: "Congés payés",
      startDate: "2024-01-15",
      endDate: "2024-01-19",
      status: "approved"
    },
    {
      id: 2,
      user: "Jean Martin",
      type: "RTT",
      startDate: "2024-01-22",
      endDate: "2024-01-22",
      status: "pending"
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendrier</h1>
            <p className="text-muted-foreground">Planning des congés de l'équipe</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Événements à venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{event.user}</p>
                    <p className="text-sm text-muted-foreground">{event.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={event.status === "approved" ? "default" : "secondary"}>
                    {event.status === "approved" ? "Approuvé" : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Calendar