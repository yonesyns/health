
import { 
  Calendar, 
  FileText, 
  Home, 
  MessageSquare, 
  Search, 
  User, 
  Bell, 
  AlertTriangle,
  Heart,
  Settings,
  Moon,
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Rechercher médecin",
    url: "/search",
    icon: Search,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Mes rendez-vous",
    url: "/appointments",
    icon: Calendar,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Dossier médical",
    url: "/medical-file",
    icon: FileText,
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "Urgences",
    url: "/emergency",
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-500"
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: 1,
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    title: "Rappels",
    url: "/reminders",
    icon: Bell,
    badge: 3,
    badgeVariant: "secondary" as const,
    gradient: "from-amber-500 to-orange-500"
  },
  {
    title: "Mon profil",
    url: "/profile",
    icon: User,
    gradient: "from-slate-500 to-gray-500"
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r-0 shadow-xl bg-gradient-to-b from-sidebar to-sidebar/95">
      <SidebarHeader className="border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar to-sidebar/90">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Medi<span className="text-primary">Care</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Votre santé, notre priorité ✨
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2">
            Navigation Principale
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`
                      relative overflow-hidden transition-all duration-200 hover:scale-[1.02]
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-md border-r-2 border-primary' 
                        : 'hover:bg-muted/50'
                      }
                    `}>
                      <NavLink to={item.url} className="flex items-center gap-3 p-3 rounded-lg group">
                        <div className={`
                          w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} 
                          flex items-center justify-center shadow-sm
                          ${isActive ? 'shadow-md scale-110' : 'group-hover:scale-105'}
                          transition-transform duration-200
                        `}>
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {item.title}
                        </span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 text-primary ml-auto" />
                        )}
                        {item.badge && (
                          <SidebarMenuBadge>
                            <Badge 
                              variant={item.badgeVariant || "destructive"} 
                              className="ml-auto animate-bounce shadow-sm"
                            >
                              {item.badge}
                            </Badge>
                          </SidebarMenuBadge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-3 bg-gradient-to-r from-sidebar to-sidebar/90">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold shadow-lg">
                  PU
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  Patient User
                </span>
                <span className="text-xs text-muted-foreground">En ligne • Premium</span>
              </div>
            </div>
          </SidebarMenuItem>
          
          <Separator className="my-2 bg-sidebar-border/30" />
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start hover:bg-muted/50 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start hover:bg-muted/50 transition-colors">
                <Moon className="h-4 w-4" />
                <span>Mode Sombre</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
