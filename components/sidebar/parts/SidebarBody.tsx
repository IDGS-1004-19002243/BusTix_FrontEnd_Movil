import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { SidebarContent } from '../content';
import { menuSections } from '../../../config/menuData';

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
        menuSections={menuSections}
        expandedMenus={expandedMenus}
        onToggleSubmenu={onToggleSubmenu}
        isCollapsed={isCollapsed}
      />
    </ScrollView>
  );
};