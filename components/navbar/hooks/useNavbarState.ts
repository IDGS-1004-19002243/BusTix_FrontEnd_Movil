import { useState } from 'react';

export function useNavbarState(initialOpen = false) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialOpen);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };
}
