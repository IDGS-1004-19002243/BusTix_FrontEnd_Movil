export interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export interface NavbarMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  onPress: () => void;
}
