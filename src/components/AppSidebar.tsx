import { 
  LayoutGrid,
  UserSearch,
  Calendar,
  FileText,
  Zap,
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Activity
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutGrid,
  },
  {
    title: "Find Doctor",
    url: "/search",
    icon: UserSearch,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Medical Records",
    url: "/medical-file",
    icon: FileText,
  },
  {
    title: "Emergency",
    url: "/emergency",
    icon: Zap,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageCircle,
    badge: 2,
  },
  {
    title: "Notifications",
    url: "/reminders",
    icon: Bell,
    badge: 5,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const ItemContent = (
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          className={`
            relative h-11 rounded-lg transition-all duration-200 border-0
            ${isCollapsed ? 'w-11 justify-center' : 'w-full'}
            ${isActive 
              ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }
          `}
        >
          <NavLink to={item.url} className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'}`}>
            <item.icon className="h-5 w-5" />
            
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium">
                  {item.title}
                </span>
                {item.badge && (
                  <span className={`
                    ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-medium
                    ${isActive ? 'bg-sidebar-primary-foreground text-sidebar-primary' : 'bg-sidebar-primary text-sidebar-primary-foreground'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            
            {isCollapsed && item.badge && (
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-sidebar-primary" />
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {ItemContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="border-0 bg-sidebar-primary text-sidebar-primary-foreground">
            <p className="font-medium">{item.title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return ItemContent
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar 
        collapsible="icon"
        className="border-0"
      >
        <SidebarHeader className="border-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-16 px-3`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                    <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold text-sidebar-foreground">
                    MediCare
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  onClick={toggleSidebar}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                onClick={toggleSidebar}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="border-0 px-3">
          <SidebarGroup className="space-y-1">
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <NavItem 
                    key={item.title} 
                    item={item} 
                    isActive={location.pathname === item.url}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="flex-1" />

          {/* Settings & Logout */}
          <SidebarGroup className="space-y-1 pb-4">
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem 
                  item={{ title: "Settings", url: "/settings", icon: Settings }}
                  isActive={location.pathname === "/settings"}
                />
                <NavItem 
                  item={{ title: "Logout", url: "/logout", icon: LogOut }}
                  isActive={false}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-0 p-3">
          <div className={`
            flex items-center gap-3 rounded-lg bg-card p-3 border
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <Avatar className={`${isCollapsed ? 'h-8 w-8' : 'h-9 w-9'}`}>
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                JD
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@medicare.com</p>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}