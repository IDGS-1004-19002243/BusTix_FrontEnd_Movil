import { useState } from 'react';

export function useSidebarState(initialCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  return { isCollapsed, toggleCollapse };
}
