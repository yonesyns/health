
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Bell, Search, Settings, Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function Header() {
  const location = useLocation()
  const pathname = location.pathname || '/'
  const routeName = pathname.replace('/', '') || 'dashboard'

  const pageTitles: Record<string, string> = {
    '': 'Tableau de Bord',
    dashboard: 'Tableau de Bord',
    search: 'Rechercher Médecin',
    appointments: 'Mes Rendez-vous',
    'medical-file': 'Dossier Médical',
    emergency: 'Urgences',
    messages: 'Messages',
    reminders: 'Rappels',
    profile: 'Mon Profil',
  }

  const pageTitle = pageTitles[routeName] || 'MediCare'
  const currentDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden" />
          <div className="hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground text-sm font-bold">M</span>
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {pageTitle}
                </h1>
                <p className="text-xs text-muted-foreground capitalize hidden lg:block">
                  {currentDate}
                </p>
              </div>
            </div>
          </div>
          <h1 className="text-lg font-bold text-foreground sm:hidden">
            {pageTitle}
          </h1>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un médecin, service..."
              className="pl-10 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search button for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-8 w-8 hidden lg:flex">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3">
            <div className="relative">
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-full flex items-center justify-center shadow-lg ring-2 ring-background">
                <span className="text-primary-foreground text-sm font-semibold">PU</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-foreground">Patient User</p>
              <p className="text-xs text-muted-foreground">En ligne</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
