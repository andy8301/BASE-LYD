import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Database, 
  Mail, 
  FileText, 
  AlertTriangle, 
  Users, 
  Home,
  ClipboardList,
  Scale,
  TrendingUp,
  Menu,
  X
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    description: "Panel principal de control"
  },
  { 
    title: "Base Olga", 
    url: "/base-olga", 
    icon: Database,
    description: "Expedientes y actos administrativos"
  },
  { 
    title: "Correos Electrónicos", 
    url: "/correos", 
    icon: Mail,
    description: "Gestión de correspondencia"
  },
  { 
    title: "Base Nexura", 
    url: "/nexura", 
    icon: FileText,
    description: "PQRSD y radicación"
  },
  { 
    title: "Traslados", 
    url: "/traslados", 
    icon: ClipboardList,
    description: "Procesos de traslado"
  },
  { 
    title: "Resoluciones", 
    url: "/resoluciones", 
    icon: Scale,
    description: "Resoluciones administrativas"
  },
  { 
    title: "Fiscalización", 
    url: "/fiscalizacion", 
    icon: TrendingUp,
    description: "Traslados fiscalización"
  },
  { 
    title: "Tutelas", 
    url: "/tutelas", 
    icon: AlertTriangle,
    description: "Acciones de tutela"
  },
  { 
    title: "Reportes", 
    url: "/reportes", 
    icon: BarChart3,
    description: "Informes y análisis"
  }
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full";
    if (isActive(path)) {
      return `${baseClasses} bg-gradient-primary text-primary-foreground shadow-corporate font-medium`;
    }
    return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent`;
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-72"} transition-all duration-300`}>
      <SidebarContent className="bg-card border-r border-border">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    Control de Procesos
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Subgerencia
                  </p>
                </div>
              )}
            </div>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-4 py-6 flex-1">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Navegación
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Sistema Integral
                </p>
                <p className="text-xs text-muted-foreground">
                  v1.0.0
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}