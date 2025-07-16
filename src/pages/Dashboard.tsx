
import { Activity, Calendar, MessageSquare, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rendez-vous à venir
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages non lus
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Nouveau message
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Médecins suivis
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Spécialistes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              État de santé
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bon</div>
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Dr. Martin Dubois</p>
                <p className="text-sm text-muted-foreground">Cardiologue</p>
                <p className="text-sm text-muted-foreground">Demain à 14h30</p>
              </div>
              <Button variant="outline" size="sm">
                Voir détails
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Dr. Sophie Laurent</p>
                <p className="text-sm text-muted-foreground">Généraliste</p>
                <p className="text-sm text-muted-foreground">Vendredi à 10h00</p>
              </div>
              <Button variant="outline" size="sm">
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rappels importants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
              <div>
                <p className="font-medium">Prise de médicament</p>
                <p className="text-sm text-muted-foreground">Aspirine - 18h00</p>
              </div>
              <Button variant="outline" size="sm">
                Fait
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
              <div>
                <p className="font-medium">Examen de routine</p>
                <p className="text-sm text-muted-foreground">Prendre RDV dans 2 semaines</p>
              </div>
              <Button variant="outline" size="sm">
                Programmer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
