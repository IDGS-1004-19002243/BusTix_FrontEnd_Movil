import React from 'react';
import { usePathname } from 'expo-router';
import type { MenuItem as MenuItemType } from '@/types/sidebar.types';
import type { SidebarMenuItemProps } from './types';
import SidebarMenuItemExpanded from '../menu-item-expanded';
import SidebarMenuItemCollapsed from '../menu-item-collapsed';

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isExpanded,
  sidebarOpen,
  onToggleSubmenu,
}) => {
  const pathname = usePathname();
  // Mejorar detección de ruta activa - quitar (pages) del route para comparar
  const normalizedRoute = item.route?.replace('/(pages)', '') || '';
  const isActive = normalizedRoute ? (pathname === normalizedRoute || pathname.startsWith(normalizedRoute + '/')) : false;
  // Verificar si algún subitem está activo (para marcar el item principal como activo)
  const hasActiveSubitem = item.submenu?.some((subItem: MenuItemType) => {
    const normalizedSubRoute = subItem.route?.replace('/(pages)', '') || '';
    return normalizedSubRoute && (pathname === normalizedSubRoute || pathname.startsWith(normalizedSubRoute + '/'));
  }) || false;
  // El item principal está activo si su ruta coincide O si tiene un subitem activo
  const isParentActive = isActive || hasActiveSubitem;
  // Sidebar expandida
  if (sidebarOpen) {
    return (
      <SidebarMenuItemExpanded
        item={item}
        isExpanded={isExpanded}
        isParentActive={isParentActive}
        onToggleSubmenu={onToggleSubmenu}
      />
    );
  }
  // Sidebar contraída
  return (
    <SidebarMenuItemCollapsed
      item={item}
      isParentActive={isParentActive}
    />
  );
};

export default SidebarMenuItem;
