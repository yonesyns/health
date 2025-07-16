
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Bell, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const location = useLocation()
  const pathname = location.pathname || '/'
  const routeName = pathname.replace('/', '') || 'dashboard'

  const pageTitles: Record<string, string> = {
    '': 'Bonjour Patient',
    dashboard: 'Bonjour Patient',
    search: 'Rechercher médecin',
    appointments: 'Mes Rendez-vous',
    'medical-file': 'Dossier médical',
    emergency: 'Urgences',
    messages: 'Messages',
    reminders: 'Rappels',
    profile: 'Mon profil',
  }

  const pageTitle = pageTitles[routeName] || 'MediCare'
  const currentDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              {pageTitle}
              <span className="text-lg">👋</span>
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block capitalize">
              {currentDate}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">PU</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">Patient User</p>
              <p className="text-xs text-muted-foreground">Patient</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
