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
  X,
  Activity,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
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

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const ItemContent = (
      <NavLink
        to={item.url}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <item.icon className={`flex-shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-5 w-5'}`} />
        
        {!isCollapsed && (
          <>
            <span className="text-sm font-medium truncate">
              {item.title}
            </span>
            {item.badge && (
              <span className={`
                ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-medium
                ${isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}
              `}>
                {item.badge}
              </span>
            )}
          </>
        )}
        
        {isCollapsed && item.badge && (
          <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </NavLink>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {ItemContent}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-0">
              <p className="font-medium">{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return ItemContent
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="h-10 w-10 bg-white shadow-lg border-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl z-50 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                MediCare
              </span>
            </div>
          )}
          
          {/* Desktop Collapse Button */}
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavItem 
                key={item.title} 
                item={item} 
                isActive={location.pathname === item.url}
              />
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 border-t border-gray-100 space-y-2">
            {bottomItems.map((item) => (
              <NavItem 
                key={item.title} 
                item={item} 
                isActive={location.pathname === item.url}
              />
            ))}
          </div>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className={`
              flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200
              ${isCollapsed ? 'justify-center' : ''}
            `}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john@medicare.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for desktop */}
      {/* <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} /> */}
    </>
  )
}