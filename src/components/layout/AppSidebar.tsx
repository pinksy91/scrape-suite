import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Globe, 
  FolderTree, 
  Search, 
  Settings, 
  Activity,
  ChevronRight,
  Database
} from "lucide-react";
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
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Panoramica e statistiche"
  },
  {
    title: "Ricerca",
    url: "/search",
    icon: Search,
    description: "Cerca tra tutti i risultati"
  },
  {
    title: "Siti",
    url: "/sites",
    icon: Globe,
    description: "Gestisci siti di scraping"
  },
  {
    title: "Gruppi",
    url: "/groups",
    icon: FolderTree,
    description: "Organizza per categorie"
  },
  {
    title: "Risultati",
    url: "/results",
    icon: Database,
    description: "Tutti gli item scrapati"
  },
  {
    title: "Attività",
    url: "/activity",
    icon: Activity,
    description: "Log e monitoraggio"
  },
];

const settingsItems = [
  {
    title: "Impostazioni",
    url: "/settings",
    icon: Settings,
    description: "Configurazione globale"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group";
    const activeClasses = isActive(path) 
      ? "bg-gradient-primary text-primary-foreground shadow-medium font-medium" 
      : "hover:bg-surface-variant hover:shadow-subtle";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <Sidebar className={`border-r bg-gradient-surface ${collapsed ? "w-16" : "w-64"}`}>
      {/* Header */}
      <div className={`p-4 border-b bg-gradient-primary ${collapsed ? "px-2" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">ScraperHub</h1>
              <p className="text-xs text-primary-foreground/80">Pro Edition</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      <SidebarContent className="p-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Navigazione</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-5 h-5"} flex-shrink-0`} />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      )}
                      {!collapsed && isActive(item.url) && (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          {!collapsed && <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Sistema</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-5 h-5"} flex-shrink-0`} />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Collapse trigger */}
      {collapsed && (
        <div className="p-2 border-t">
          <SidebarTrigger className="w-full" />
        </div>
      )}
    </Sidebar>
  );
}