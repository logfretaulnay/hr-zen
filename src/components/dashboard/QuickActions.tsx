import { Plus, Calendar, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: "Nouvelle demande",
      description: "Créer une demande de congé",
      variant: "default" as const,
      className: "btn-hero"
    },
    {
      icon: Calendar,
      label: "Voir le calendrier",
      description: "Planning de l'équipe",
      variant: "outline" as const
    },
    {
      icon: FileText,
      label: "Mes demandes",
      description: "Historique et status",
      variant: "outline" as const
    },
    {
      icon: Clock,
      label: "Mes soldes",
      description: "Jours disponibles",
      variant: "outline" as const
    }
  ]

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant={action.variant}
            className={`h-auto p-4 flex flex-col items-start gap-2 ${action.className || ''}`}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="h-4 w-4" />
              <span className="font-medium">{action.label}</span>
            </div>
            <span className="text-xs text-left opacity-80">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}