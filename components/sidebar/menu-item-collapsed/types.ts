import type { MenuItem as MenuItemType } from '../../../types/sidebar.types';

export interface SidebarMenuItemCollapsedProps {
  item: MenuItemType;
  isParentActive: boolean;
}
