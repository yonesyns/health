
import { Activity, Calendar, MessageSquare, Users, TrendingUp, Clock, Heart, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground shadow-xl">
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Bonjour Patient User! 👋
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Votre santé est notre priorité. Voici votre résumé quotidien.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Rendez-vous à venir
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Cette semaine</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Messages non lus
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">1</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Zap className="h-3 w-3" />
              <span>Nouveau message</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Médecins suivis
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Heart className="h-3 w-3" />
              <span>Spécialistes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              État de santé
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">Bon</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>Dernière mise à jour</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                <Calendar className="h-3 w-3 text-white" />
              </div>
              Prochains rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-200 hover:shadow-md">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Dr. Martin Dubois</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Cardiologue</Badge>
                  <span className="text-sm text-muted-foreground">Demain à 14h30</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                Voir détails
              </Button>
            </div>
            
            <div className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-200 hover:shadow-md">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Dr. Sophie Laurent</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Généraliste</Badge>
                  <span className="text-sm text-muted-foreground">Vendredi à 10h00</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md flex items-center justify-center">
                <Bell className="h-3 w-3 text-white" />
              </div>
              Rappels importants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between p-4 border border-amber-200 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 hover:shadow-md transition-all duration-200">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Prise de médicament</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white text-xs">Urgent</Badge>
                  <span className="text-sm text-muted-foreground">Aspirine - 18h00</span>
                </div>
              </div>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                Fait
              </Button>
            </div>
            
            <div className="group flex items-center justify-between p-4 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-md transition-all duration-200">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Examen de routine</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Planifié</Badge>
                  <span className="text-sm text-muted-foreground">Prendre RDV dans 2 semaines</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-blue-500 hover:text-white transition-colors">
                Programmer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
