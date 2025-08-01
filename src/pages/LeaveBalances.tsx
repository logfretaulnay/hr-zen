import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLeaves } from "@/hooks/useLeaves"
import { Clock, Calendar, Award, TrendingUp } from "lucide-react"

const LeaveBalances = () => {
  const { balances, loading } = useLeaves()

  const getIcon = (label: string) => {
    switch (label) {
      case 'Congés payés': return Calendar
      case 'RTT': return Clock
      case 'Congés maladie': return Award
      default: return TrendingUp
    }
  }

  const getColor = (label: string) => {
    switch (label) {
      case 'Congés payés': return "text-primary"
      case 'RTT': return "text-secondary"
      case 'Congés maladie': return "text-warning"
      default: return "text-accent"
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes soldes de congés</h1>
          <p className="text-muted-foreground">Consultez vos jours de congés disponibles</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {balances.map((balance) => {
            const Icon = getIcon(balance.leave_type_label)
            const colorClass = getColor(balance.leave_type_label)
            const usagePercentage = (Number(balance.used_days) / balance.total_days) * 100

            return (
              <Card key={balance.leave_type_label} className="card-elevated">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${colorClass}`} />
                    <CardTitle className="text-lg">{balance.leave_type_label}</CardTitle>
                  </div>
                  <CardDescription>
                    {balance.remaining_days} jours restants sur {balance.total_days}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilisés</span>
                      <span>{balance.used_days} jours</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{balance.total_days}</p>
                      <p className="text-xs text-muted-foreground">Alloués</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">{balance.used_days}</p>
                      <p className="text-xs text-muted-foreground">Utilisés</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{balance.remaining_days}</p>
                      <p className="text-xs text-muted-foreground">Restants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {balances.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun solde disponible</h3>
              <p className="text-muted-foreground">Vos soldes de congés seront disponibles prochainement</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

export default LeaveBalances