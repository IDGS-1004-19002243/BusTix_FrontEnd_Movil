import { Slot } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';

export default function PagesLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

 
  return (
    <View style={{ flex: 1, flexDirection: 'row', paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Sidebar 
        isOpen={isMobile ? isSidebarOpen : true} 
        onClose={closeSidebar}
        isCollapsed={!isMobile && isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      {/* Contenido principal */}
      <View style={{ flex: 1 }}>
        {/* Navbar */}
        <Navbar 
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* Contenido de las páginas */}
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <Slot />
        </View>
      </View>
    </View>
  );
}
