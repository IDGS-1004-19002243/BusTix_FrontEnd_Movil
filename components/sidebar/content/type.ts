import type { MenuSection } from '@/types/sidebar.types';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface SidebarContentProps {
  sidebarOpen: boolean;
  menuSections: MenuSection[];
  expandedMenus: { [key: string]: boolean };
  onToggleSubmenu: (menuKey: string) => void;
  isCollapsed?: boolean;
}
