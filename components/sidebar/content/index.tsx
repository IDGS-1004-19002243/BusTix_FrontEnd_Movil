import React from 'react';
import { View, Text } from 'react-native';
import type { MenuItem } from '@/types/sidebar.types';
import SidebarMenuItem from '../menu-item';
import { styles } from './styles';
import type { SidebarContentProps } from './type';


export const SidebarContent: React.FC<SidebarContentProps> = ({
  sidebarOpen,
  menuSections,
  expandedMenus,
  onToggleSubmenu,
  isCollapsed = false,
}) => {
  return (
  <View style={styles.contentContainer}>
      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View 
          key={sectionIndex} 
          style={[
            sectionIndex === 0 ? styles.sectionContainerFirst : styles.sectionContainer,
            isCollapsed && { marginTop: 0 }
          ]}
        >
          {sidebarOpen && !isCollapsed && (
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>
          )}
          {section.items.map((item: MenuItem, itemIndex: number) => {
            const isExpanded = item.key ? expandedMenus[item.key] : false;
            
            return (
              <View 
                key={itemIndex}
                style={isCollapsed ? styles.menuItemWrapper : undefined}
              >
                <SidebarMenuItem
                  item={item}
                  isExpanded={isExpanded}
                  sidebarOpen={sidebarOpen}
                  onToggleSubmenu={() => item.key && onToggleSubmenu(item.key)}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
