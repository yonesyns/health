
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
  LogOut
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

const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Rechercher médecin",
    url: "/search",
    icon: Search,
  },
  {
    title: "Mes rendez-vous",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Dossier médical",
    url: "/medical-file",
    icon: FileText,
  },
  {
    title: "Urgences",
    url: "/emergency",
    icon: AlertTriangle,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: 1,
  },
  {
    title: "Rappels",
    url: "/reminders",
    icon: Bell,
    badge: 3,
    badgeVariant: "secondary" as const,
  },
  {
    title: "Mon profil",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">
              Medi<span className="text-primary">Care</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Votre santé, notre priorité
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge>
                          <Badge variant={item.badgeVariant || "destructive"} className="ml-auto">
                            {item.badge}
                          </Badge>
                        </SidebarMenuBadge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm">
                PU
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  Patient User
                </span>
                <span className="text-xs text-muted-foreground">Patient</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Moon className="h-4 w-4" />
                <span>Mode Sombre</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
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
