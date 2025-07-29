import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Award } from "lucide-react"

const Balance = () => {
  const balances = [
    {
      type: "Congés payés",
      acquired: 25,
      used: 8,
      remaining: 17,
      icon: Calendar,
      color: "text-primary"
    },
    {
      type: "RTT",
      acquired: 12,
      used: 3,
      remaining: 9,
      icon: Clock,
      color: "text-secondary"
    },
    {
      type: "Récupération",
      acquired: 5,
      used: 1,
      remaining: 4,
      icon: Award,
      color: "text-accent"
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes soldes</h1>
          <p className="text-muted-foreground">Consultez vos jours de congés disponibles</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {balances.map((balance) => (
            <Card key={balance.type}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <balance.icon className={`h-5 w-5 ${balance.color}`} />
                  <CardTitle className="text-lg">{balance.type}</CardTitle>
                </div>
                <CardDescription>
                  {balance.remaining} jours restants sur {balance.acquired}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilisés</span>
                    <span>{balance.used} jours</span>
                  </div>
                  <Progress value={(balance.used / balance.acquired) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{balance.acquired}</p>
                    <p className="text-xs text-muted-foreground">Acquis</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">{balance.used}</p>
                    <p className="text-xs text-muted-foreground">Utilisés</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{balance.remaining}</p>
                    <p className="text-xs text-muted-foreground">Restants</p>
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

export default Balance