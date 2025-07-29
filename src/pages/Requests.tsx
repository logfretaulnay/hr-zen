import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, User } from "lucide-react"

const Requests = () => {
  const mockRequests = [
    {
      id: 1,
      type: "Congés payés",
      startDate: "2024-01-15",
      endDate: "2024-01-19",
      duration: "5 jours",
      status: "approved",
      requestDate: "2024-01-05"
    },
    {
      id: 2,
      type: "RTT",
      startDate: "2024-02-01",
      endDate: "2024-02-01",
      duration: "1 jour",
      status: "pending",
      requestDate: "2024-01-20"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success text-success-foreground"
      case "pending": return "bg-warning text-warning-foreground"
      case "rejected": return "bg-destructive text-destructive-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approuvé"
      case "pending": return "En attente"
      case "rejected": return "Refusé"
      default: return "Inconnu"
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mes demandes</h1>
            <p className="text-muted-foreground">Gérez vos demandes de congés</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>

        <div className="grid gap-4">
          {mockRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{request.type}</CardTitle>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Du {new Date(request.startDate).toLocaleDateString()} au {new Date(request.endDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {request.duration}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Demandé le {new Date(request.requestDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default Requests