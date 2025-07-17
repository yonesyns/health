import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Bell, Search, Settings, Moon, Sun, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from 'react'

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
    settings: 'Paramètres',
  }

  const pageTitle = pageTitles[routeName] || 'MediCare'
  const currentDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                {pageTitle}
              </h1>
              <p className="hidden sm:block text-xs text-gray-500">
                {currentDate}
              </p>
            </div>
          </div>
        </div>

        {/* Center section - Search (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          {/* <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Sun className="h-4 w-4" />
          </Button> */}

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-gray-200">
            <div className="relative">
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                <span className="text-white text-sm font-semibold">PU</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-900">Patient User</p>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}