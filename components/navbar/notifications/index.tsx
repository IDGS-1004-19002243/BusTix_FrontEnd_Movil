import React, { useState, useEffect } from 'react';
import { View, Text, Platform, useWindowDimensions, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Check, Trash2 } from 'lucide-react-native';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';

import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import LoadingScreen from '@/components/compra/LoadingScreen';
import { Notificacion, apiGetMisNotificaciones, apiMarcarNotificacionLeida, apiEliminarNotificacion, apiMarcarTodasLeidas, apiGetCountNoLeidas } from '@/services/notificaciones/notificaciones.service';

const Notifications = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [notificationsList, setNotificationsList] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (showDrawer && notificationsList.length === 0) {
      fetchNotifications();
    }
  }, [showDrawer]);

  const fetchUnreadCount = async () => {
    try {
      const response = await apiGetCountNoLeidas();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetMisNotificaciones();
      if (response.success) {
        setNotificationsList(response.data);
        const unread = response.data.filter(n => !n.fueLeida).length;
        setUnreadCount(unread);
      } else {
        setError('Error al obtener notificaciones');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const getDrawerSize = () => {
    const isTablet = width >= 768;
    const isLargeScreen = width >= 1100;
    const isExtraLargeScreen = width >= 1440;
    
    if (Platform.OS === 'web') {
      if (isExtraLargeScreen) return 'sm';
      if (isLargeScreen) return 'md';
      return isTablet ? 'md' : 'lg';
    }
    
    return isTablet ? 'sm' : 'lg';
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await apiMarcarNotificacionLeida(id);
      if (response.success) {
        setNotificationsList(prev => prev.map(n => n.notificacionID === id ? { ...n, fueLeida: true, fechaLectura: response.fechaLectura || null } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiEliminarNotificacion(id);
      if (response.success) {
        const wasUnread = notificationsList.find(n => n.notificacionID === id)?.fueLeida === false;
        setNotificationsList(prev => prev.filter(n => n.notificacionID !== id));
        if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await apiMarcarTodasLeidas();
      if (response.success) {
        setNotificationsList(prev => prev.map(n => ({ ...n, fueLeida: true, fechaLectura: new Date().toISOString() })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteAll = () => {
    const deletedUnread = notificationsList.filter(n => !n.fueLeida).length;
    setNotificationsList([]);
    setUnreadCount(prev => Math.max(0, prev - deletedUnread));
  };

  return (
    <>
      <View className="relative">
        <Button 
          variant="solid"
          size={Platform.OS === 'web' ? 'sm' : 'lg'}
          action="secondary"
          className={`bg-white px-2 border border-[#DFE3E8] rounded-full ${Platform.OS === 'web' ? 'h-8 w-8' : 'h-10 w-10'} items-center justify-center`}
          onPress={() => setShowDrawer(true)}
        >
          <ButtonIcon 
            as={Bell}
            className={`${Platform.OS === 'web' ? 'w-4 h-4' : 'w-5 h-5'}`}
          />
        </Button>
        
        {unreadCount > 0 && (
          <Badge
            className={`absolute top-0 right-0 ${Platform.OS === 'web' ? 'h-5 w-5' : 'h-6 w-6'} bg-error-600 rounded-full items-center justify-center`}
            variant="solid"
            style={{ transform: [{ translateX: 10 }, { translateY: -7 }] }}
          >
            <BadgeText className="text-white font-semibold mb-0.5" style={{ fontSize: 11 }}>{unreadCount}</BadgeText>
          </Badge>
        )}
      </View>

      <Drawer
        isOpen={showDrawer}
        size={getDrawerSize()}
        anchor="right"
        onClose={() => setShowDrawer(false)}
      >
        <DrawerBackdrop style={{ 
          marginTop: insets.top,
          marginBottom: insets.bottom,
        }} />
        <DrawerContent style={{ 
          top: insets.top,
          bottom: insets.bottom,
          paddingBottom: Platform.OS === 'web' ? 10 : undefined
        }} >
          <DrawerHeader>
            <Heading size="lg">Notificaciones</Heading>
            <DrawerCloseButton>
              <Icon as={CloseIcon} />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody className="flex-1 mt-2">
            {loading ? (
              <LoadingScreen message="Cargando notificaciones..." />
            ) : error ? (
              <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-500 text-center mb-4">{error}</Text>
                <Button onPress={fetchNotifications} size="sm" action="positive">
                  <ButtonText>Reintentar</ButtonText>
                </Button>
              </View>
            ) : (
              <ScrollView className="flex-1">
                <VStack className="p-1 gap-3">
                  {notificationsList.map((notification) => (
                    <Card
                      key={notification.notificacionID}
                      className={`py-3 px-2 border border-gray-200 ${notification.fueLeida ? 'bg-gray-50' : 'bg-blue-50'}`}
                    >
                      <Text className="font-semibold text-base">{notification.titulo}</Text>
                      <Text className="text-sm text-gray-600 mt-1">{notification.mensaje}</Text>
                      <Text className="text-xs text-gray-400 mt-2">{new Date(notification.fechaCreacion).toLocaleString()}</Text>
                      
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                        {!notification.fueLeida && (
                          <Button
                            size="xs"
                            variant="outline"
                            action="positive"
                            onPress={() => handleMarkAsRead(notification.notificacionID)}
                          >
                            <ButtonIcon as={Check} size="xs" />
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          action="negative"
                          onPress={() => handleDelete(notification.notificacionID)}
                        >
                          <ButtonIcon as={Trash2} size="xs" />
                        </Button>
                      </View>
                    </Card>
                  ))}
                </VStack>
              </ScrollView>
            )}
          </DrawerBody>
          <DrawerFooter  >
            <HStack space="sm" className="w-full">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  action="positive"
                  onPress={handleMarkAllAsRead}
                  style={{ flex: 0.6 }}
                >
                  <ButtonIcon as={Check} size="sm" />
                  <ButtonText>Marcar todo</ButtonText>
                </Button>
              )}
              {notificationsList.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  action="negative"
                  onPress={handleDeleteAll}
                  style={unreadCount > 0 ? { flex: 0.4 } : { flex: 1 }}
                >
                  <ButtonIcon as={Trash2} size="sm" />
                  <ButtonText>Borrar todo</ButtonText>
                </Button>
              )}
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Notifications;
