import React, { useState } from 'react';
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
import { notifications } from './notificationsData';

const Notifications = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const unreadCount = notificationsList.filter(n => !n.read).length;

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

  const handleMarkAsRead = (id: number) => {
    setNotificationsList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDelete = (id: number) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    //  ...n copia todas las propiedades del objeto n (notificación) y luego sobrescribe solo la propiedad read con true
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteAll = () => {
    setNotificationsList([]);
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
            <ScrollView className="flex-1">
              <VStack className="p-1 gap-3">
                {notificationsList.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`py-3 px-2 border border-gray-200 ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                  >
                    <Text className="font-semibold text-base">{notification.title}</Text>
                    <Text className="text-sm text-gray-600 mt-1">{notification.message}</Text>
                    <Text className="text-xs text-gray-400 mt-2">{notification.time}</Text>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                      {!notification.read && (
                        <Button
                          size="xs"
                          variant="outline"
                          action="positive"
                          onPress={() => handleMarkAsRead(notification.id)}
                        >
                          <ButtonIcon as={Check} size="xs" />
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="outline"
                        action="negative"
                        onPress={() => handleDelete(notification.id)}
                      >
                        <ButtonIcon as={Trash2} size="xs" />
                      </Button>
                    </View>
                  </Card>
                ))}
              </VStack>
            </ScrollView>
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
