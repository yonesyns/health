
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
  Plus,
  Activity
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
    iconColor: "text-blue-600"
  },
  {
    title: "Rechercher médecin",
    url: "/search",
    icon: Search,
    iconColor: "text-emerald-600"
  },
  {
    title: "Mes rendez-vous",
    url: "/appointments",
    icon: Calendar,
    iconColor: "text-purple-600"
  },
  {
    title: "Dossier médical",
    url: "/medical-file",
    icon: FileText,
    iconColor: "text-orange-600"
  },
  {
    title: "Urgences",
    url: "/emergency",
    icon: AlertTriangle,
    iconColor: "text-red-600"
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: 1,
    iconColor: "text-indigo-600"
  },
  {
    title: "Rappels",
    url: "/reminders",
    icon: Bell,
    badge: 3,
    badgeVariant: "secondary" as const,
    iconColor: "text-amber-600"
  },
  {
    title: "Mon profil",
    url: "/profile",
    icon: User,
    iconColor: "text-slate-600"
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r bg-white/95 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 bg-white/80">
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg ring-1 ring-primary/20">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white shadow-sm"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">
              MediCare
            </h1>
            <p className="text-sm text-muted-foreground">
              Votre santé connectée
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`
                      relative h-11 transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary border-r-3 border-primary shadow-sm' 
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                      }
                    `}>
                      <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-xl group">
                        <div className={`
                          flex items-center justify-center w-7 h-7 rounded-lg
                          ${isActive ? 'bg-primary/20' : 'bg-muted/50 group-hover:bg-muted'}
                          transition-colors duration-200
                        `}>
                          <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : item.iconColor}`} />
                        </div>
                        <span className={`font-medium text-sm ${isActive ? 'text-primary' : ''}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <SidebarMenuBadge>
                            <Badge 
                              variant={item.badgeVariant || "destructive"} 
                              className="ml-auto text-xs px-2 py-0.5"
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

        <Separator className="my-6 mx-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-2">
            Actions rapides
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 hover:bg-muted/60 text-muted-foreground hover:text-foreground">
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-xl">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      <Plus className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-sm">Nouveau RDV</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 hover:bg-muted/60 text-muted-foreground hover:text-foreground">
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-xl">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-sm">Suivi santé</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4 bg-white/80">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 mb-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm">
                  JD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  John Doe
                </span>
                <span className="text-xs text-muted-foreground">Patient Premium</span>
              </div>
            </div>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 hover:bg-muted/60 text-muted-foreground hover:text-foreground">
              <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-xl">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Paramètres</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 hover:bg-muted/60 text-muted-foreground hover:text-foreground">
              <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-xl">
                <Moon className="h-4 w-4" />
                <span className="text-sm">Mode sombre</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 hover:bg-destructive/10 text-destructive hover:text-destructive">
              <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-xl">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Déconnexion</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
