import type { MenuSection } from '@/types/sidebar.types';
import { Animated, GestureResponderHandlers } from 'react-native';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  slideAnim: Animated.Value;
  panHandlers?: GestureResponderHandlers;
}

export interface SidebarContentProps {
  sidebarOpen: boolean;
  menuSections: MenuSection[];
  expandedMenus: { [key: string]: boolean };
  onToggleSubmenu: (menuKey: string) => void;
  isCollapsed?: boolean;
}
