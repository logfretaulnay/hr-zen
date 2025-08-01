import { useState } from "react"
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  Clock,
  User
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Mes demandes", url: "/requests", icon: FileText },
  { title: "Calendrier", url: "/calendar", icon: Calendar },
  { title: "Mes soldes", url: "/balance", icon: Clock },
]

const managerItems = [
  { title: "Équipe", url: "/team", icon: Users },
  { title: "Validations", url: "/approvals", icon: BarChart3 },
]

const adminItems = [
  { title: "Utilisateurs", url: "/admin/users", icon: User },
  { title: "Paramètres", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  const { role, isManager, isAdmin } = useAuth()
  const userRole = role.toLowerCase() as "employee" | "manager" | "admin"

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">HR</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-sidebar-foreground">HRFlow</h1>
              <p className="text-xs text-sidebar-foreground/70">Gestion des congés</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 px-3">
            {!collapsed && "Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isManager && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 px-3">
              {!collapsed && "Management"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {managerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${getNavCls({ isActive })}`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 px-3">
              {!collapsed && "Administration"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${getNavCls({ isActive })}`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}