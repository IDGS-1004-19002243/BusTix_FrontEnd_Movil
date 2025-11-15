import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { SidebarContent } from '../content';
import { menuSections } from '../../../config/menuData';
import { useSession } from '@/context/AuthContext';

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
  const { role } = useSession();

  // Filtrar secciones e items basados en el rol
  const filteredMenuSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      !item.roles || item.roles.includes(role || '')
    ).map(item => ({
      ...item,
      submenu: item.submenu?.filter(subItem => 
        !subItem.roles || subItem.roles.includes(role || '')
      )
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