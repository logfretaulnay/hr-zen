import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Settings, Users as UsersIcon, Mail, Shield } from "lucide-react"

const Users = () => {
  const users = [
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie.dupont@company.com",
      role: "employee",
      department: "Développement",
      status: "active",
      lastLogin: "2024-01-25"
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@company.com",
      role: "manager",
      department: "Design",
      status: "active",
      lastLogin: "2024-01-24"
    },
    {
      id: 3,
      name: "Sophie Blanc",
      email: "sophie.blanc@company.com",
      role: "admin",
      department: "RH",
      status: "active",
      lastLogin: "2024-01-25"
    }
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-destructive text-destructive-foreground"
      case "manager": return "bg-warning text-warning-foreground"
      case "employee": return "bg-success text-success-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin": return "Administrateur"
      case "manager": return "Manager"
      case "employee": return "Employé"
      default: return "Inconnu"
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UsersIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
              <p className="text-muted-foreground">Administrer les comptes utilisateurs</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleText(user.role)}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Département :</strong> {user.department}
                  </div>
                  <div>
                    <strong>Statut :</strong> <span className="text-success">Actif</span>
                  </div>
                  <div>
                    <strong>Dernière connexion :</strong> {new Date(user.lastLogin).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default Users