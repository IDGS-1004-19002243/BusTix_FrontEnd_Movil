export interface MenuItem {
  label: string;
  icon?: React.ComponentType<any>;
  route?: string;
  badge?: string;
  hasSubmenu?: boolean;
  submenu?: MenuItem[];
  active?: boolean;
  color?: string;
  bgColor?: string;
  key?: string;
  subtitle?: string;
  roles?: string[]; // Roles permitidos para este item
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
