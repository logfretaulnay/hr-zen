import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLeaves } from "@/hooks/useLeaves"
import { CheckCircle, XCircle, Clock, Calendar, User, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const TeamRequests = () => {
  const { requests, loading, approveRequest, rejectRequest } = useLeaves()
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)

  const pendingRequests = requests.filter(req => req.status === 'PENDING')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return "status-success"
      case 'REJECTED': return "status-rejected"
      case 'PENDING': return "status-pending"
      default: return "status-pending"
    }
  }

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return

    if (actionType === 'approve') {
      await approveRequest(selectedRequest, comment)
    } else {
      await rejectRequest(selectedRequest, comment)
    }

    setSelectedRequest(null)
    setComment("")
    setActionType(null)
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
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Demandes de l'équipe</h1>
            <p className="text-muted-foreground">Validez les demandes de congés de votre équipe</p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucune demande en attente</h3>
              <p className="text-muted-foreground">Toutes les demandes ont été traitées</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {request.profiles?.name || 'Utilisateur inconnu'}
                      </CardTitle>
                      <CardDescription>{request.profiles?.email}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status === 'PENDING' ? 'En attente' : request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm text-muted-foreground">
                          {request.leave_types?.label || 'Type inconnu'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Période</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(request.start_date), 'dd MMM', { locale: fr })} - {format(new Date(request.end_date), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Durée</p>
                        <p className="text-sm text-muted-foreground">{request.total_days} jour(s)</p>
                      </div>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium">Motif</p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setSelectedRequest(request.id)
                            setActionType('approve')
                          }}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approuver
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approuver la demande</DialogTitle>
                          <DialogDescription>
                            Voulez-vous approuver cette demande de congés ?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="approve-comment">Commentaire (optionnel)</Label>
                            <Textarea
                              id="approve-comment"
                              placeholder="Ajouter un commentaire..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setSelectedRequest(null)
                            setComment("")
                            setActionType(null)
                          }}>
                            Annuler
                          </Button>
                          <Button onClick={handleAction}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedRequest(request.id)
                            setActionType('reject')
                          }}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Refuser
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Refuser la demande</DialogTitle>
                          <DialogDescription>
                            Voulez-vous refuser cette demande de congés ?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reject-comment">Motif du refus</Label>
                            <Textarea
                              id="reject-comment"
                              placeholder="Expliquer le motif du refus..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setSelectedRequest(null)
                            setComment("")
                            setActionType(null)
                          }}>
                            Annuler
                          </Button>
                          <Button variant="destructive" onClick={handleAction}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Refuser
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default TeamRequests