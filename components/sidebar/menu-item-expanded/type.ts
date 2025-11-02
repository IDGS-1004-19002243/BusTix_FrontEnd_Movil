import type { MenuItem as MenuItemType } from '../../../types/sidebar.types';

export interface SidebarMenuItemExpandedProps {
  item: MenuItemType;
  isExpanded: boolean;
  isParentActive: boolean;
  onToggleSubmenu: () => void;
}
