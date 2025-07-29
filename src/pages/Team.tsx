import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock } from "lucide-react"

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie.dupont@company.com",
      role: "Développeuse",
      status: "En congé",
      statusType: "leave",
      leaveEnd: "2024-01-19"
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@company.com", 
      role: "Designer",
      status: "Présent",
      statusType: "present"
    },
    {
      id: 3,
      name: "Sophie Blanc",
      email: "sophie.blanc@company.com",
      role: "Chef de projet",
      status: "RTT demain",
      statusType: "upcoming"
    }
  ]

  const getStatusColor = (type: string) => {
    switch (type) {
      case "leave": return "bg-warning text-warning-foreground"
      case "present": return "bg-success text-success-foreground"
      case "upcoming": return "bg-blue-100 text-blue-800"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mon équipe</h1>
            <p className="text-muted-foreground">Vue d'ensemble de votre équipe</p>
          </div>
        </div>

        <div className="grid gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(member.statusType)}>
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{member.email}</span>
                  {member.leaveEnd && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Retour le {new Date(member.leaveEnd).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default Team