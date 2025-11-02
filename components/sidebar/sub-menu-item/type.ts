import type { MenuItem } from '../../../types/sidebar.types';

export interface SubMenuItemProps {
  subItem: MenuItem;
  onPress: (route?: string) => void;
}
