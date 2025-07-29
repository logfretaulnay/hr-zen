import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings as SettingsIcon, Save, Mail, Calendar, Shield, Globe } from "lucide-react"

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Paramètres système</h1>
            <p className="text-muted-foreground">Configuration globale de l'application</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Paramètres généraux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configuration de base de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input id="company-name" defaultValue="Mon Entreprise" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email de contact</Label>
                  <Input id="company-email" type="email" defaultValue="contact@company.com" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-muted-foreground">Activer pour bloquer l'accès aux utilisateurs</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Paramètres email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuration email
              </CardTitle>
              <CardDescription>
                Paramètres SMTP pour l'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Serveur SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" type="number" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Utilisateur</Label>
                  <Input id="smtp-user" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">Mot de passe</Label>
                  <Input id="smtp-pass" type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-muted-foreground">Envoyer des emails de notification</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Paramètres congés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Règles de congés
              </CardTitle>
              <CardDescription>
                Configuration des règles métier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cp-days">Congés payés par an</Label>
                  <Input id="cp-days" type="number" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtt-days">RTT par an</Label>
                  <Input id="rtt-days" type="number" defaultValue="12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advance-days">Délai minimum (jours)</Label>
                  <Input id="advance-days" type="number" defaultValue="7" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Double validation</Label>
                    <p className="text-sm text-muted-foreground">Require validation par le manager et RH</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Report automatique</Label>
                    <p className="text-sm text-muted-foreground">Reporter automatiquement les congés non pris</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Authentification LDAP</Label>
                  <p className="text-sm text-muted-foreground">Utiliser l'annuaire LDAP pour l'authentification</p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ldap-server">Serveur LDAP</Label>
                  <Input id="ldap-server" placeholder="ldap://server.company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldap-base">Base DN</Label>
                  <Input id="ldap-base" placeholder="dc=company,dc=com" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Enregistrer les paramètres
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Settings