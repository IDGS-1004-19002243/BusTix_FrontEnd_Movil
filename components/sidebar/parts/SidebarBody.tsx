import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { SidebarContent } from '../content';
import { menuSections } from '../../../config/menuData';
import { useSession } from '@/context/AuthContext';
import { routeRoles } from '@/config/routeRoles';

interface SidebarBodyProps {
  isCollapsed: boolean;
  expandedMenus: { [key: string]: boolean };
  onToggleSubmenu: (menuKey: string) => void;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({
  isCollapsed,
  expandedMenus,
  onToggleSubmenu,
}) => {
  const { user } = useSession();

  // Función helper para verificar acceso basado en routeRoles o roles del item
  const hasAccess = (route: string | undefined, itemRoles?: string[]) => {
    const role = user?.roles?.[0] || '';
    if (route) {
      const normalized = route.replace('/(pages)', '');
      const allowedRoles = routeRoles[normalized] || [];
      return allowedRoles.length === 0 || allowedRoles.includes(role);
    } else if (itemRoles && itemRoles.length > 0) {
      return itemRoles.includes(role);
    } else {
      // Items sin route ni roles: mostrar solo si el usuario está autenticado
      return !!role;
    }
  };

  // Filtrar secciones e items basados en routeRoles centralizado o roles del item
  const filteredMenuSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => hasAccess(item.route, item.roles)).map(item => ({
      ...item,
      submenu: item.submenu?.filter(subItem => hasAccess(subItem.route, subItem.roles))
    })).filter(item => item.submenu ? item.submenu.length > 0 : true)
  })).filter(section => section.items.length > 0);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: isCollapsed ? 0 : 2,
        paddingLeft: isCollapsed ? 0 : 4,
        marginLeft: isCollapsed ? 6 : 0,
        marginRight: 0,
        paddingRight:
          Platform.OS === 'ios' || Platform.OS === 'android' ? 8 : 0,
        paddingBottom: 8,
      }}
      showsVerticalScrollIndicator={Platform.OS === 'web'}
    >
      <SidebarContent
        sidebarOpen={!isCollapsed}
        menuSections={filteredMenuSections}
        expandedMenus={expandedMenus}
        onToggleSubmenu={onToggleSubmenu}
        isCollapsed={isCollapsed}
      />
    </ScrollView>
  );
};