import { Calendar, Clock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LeaveRequest {
  id: string
  employeeName: string
  type: string
  startDate: string
  endDate: string
  duration: number
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

const mockRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeName: "Sophie Martin",
    type: "Congés payés",
    startDate: "2024-12-20",
    endDate: "2024-12-31",
    duration: 8,
    status: "pending",
    submittedAt: "2024-12-02"
  },
  {
    id: "2", 
    employeeName: "Thomas Dubois",
    type: "RTT",
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    duration: 1,
    status: "approved",
    submittedAt: "2024-12-01"
  },
  {
    id: "3",
    employeeName: "Emma Leroy",
    type: "Maladie",
    startDate: "2024-11-28",
    endDate: "2024-11-29",
    duration: 2,
    status: "approved",
    submittedAt: "2024-11-28"
  }
]

export function RecentRequests() {
  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="status-pending">En attente</Badge>
      case "approved":
        return <Badge className="status-success">Approuvée</Badge>
      case "rejected":
        return <Badge className="status-rejected">Refusée</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Demandes récentes</CardTitle>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRequests.map((request) => (
          <div 
            key={request.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{request.employeeName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{request.type}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(request.startDate)}
                    {request.startDate !== request.endDate && ` - ${formatDate(request.endDate)}`}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {request.duration}j
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(request.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}