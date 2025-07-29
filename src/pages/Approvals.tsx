import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, Calendar, User } from "lucide-react"

const Approvals = () => {
  const pendingRequests = [
    {
      id: 1,
      user: "Marie Dupont",
      type: "Congés payés",
      startDate: "2024-02-15",
      endDate: "2024-02-19",
      duration: "5 jours",
      requestDate: "2024-01-20",
      reason: "Vacances en famille"
    },
    {
      id: 2,
      user: "Jean Martin",
      type: "RTT",
      startDate: "2024-02-01",
      endDate: "2024-02-01",
      duration: "1 jour",
      requestDate: "2024-01-25",
      reason: "Rendez-vous médical"
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Validations</h1>
            <p className="text-muted-foreground">Demandes en attente de validation</p>
          </div>
        </div>

        <div className="grid gap-4">
          {pendingRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {request.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{request.user}</CardTitle>
                      <CardDescription>{request.type}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">En attente</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Du {new Date(request.startDate).toLocaleDateString()} au {new Date(request.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{request.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Demandé le {new Date(request.requestDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {request.reason && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm"><strong>Motif :</strong> {request.reason}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approuver
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" />
                    Refuser
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default Approvals