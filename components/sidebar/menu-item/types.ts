import type { MenuItem as MenuItemType } from '../../../types/sidebar.types';

export interface SidebarMenuItemProps {
  item: MenuItemType;
  isExpanded: boolean;
  sidebarOpen: boolean;
  onToggleSubmenu: () => void;
}
