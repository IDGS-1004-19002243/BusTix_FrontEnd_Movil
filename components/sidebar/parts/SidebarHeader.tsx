import React from 'react';
import { View, Platform, Text, Image } from 'react-native';
import { ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react-native';
import { styles as sidebarStyles } from '../content/styles';
import { Button, ButtonIcon } from '@/components/ui/button';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  isMobile,
  onToggleCollapse,
  onClose,
}) => {
  const handleTogglePress = () => {
    if (isMobile) {
      onClose?.();
    } else {
      onToggleCollapse?.();
    }
  };

  return (
    <View
      style={[
        sidebarStyles.headerContainer,
        {
          marginBottom: isCollapsed ? 0 : 8,
          paddingLeft: 0,
          position: 'relative',
        },
      ]}
    >
      <View
        style={[
          sidebarStyles.logoWrapper,
          isCollapsed && {
            marginLeft: 9,
            flex: 1,
            alignItems: 'center',
          },
        ]}
      >
        <Image
          source={require('@/assets/images/Logo_sidebar.png')}
          style={sidebarStyles.logoImage}
          resizeMode="cover"
        />
        {!isCollapsed && (
          <Text style={sidebarStyles.logoText}>Bustix</Text>
        )}
      </View>

      {!isMobile && onToggleCollapse && (
        <View
          style={{
            position: 'absolute',
            right: -16,
            top: '50%',
            transform: [{ translateY: -16 }],
          }}
        >
          <Button
            variant="solid"
            size={Platform.OS === 'web' ? 'md' : 'lg'}
            action="secondary"
            className={`bg-white px-2 border border-[#DFE3E8] rounded-md ${
              Platform.OS === 'web' ? 'h-8' : 'h-10'
            }`}
            onPress={handleTogglePress}
          >
            <ButtonIcon
              as={isCollapsed ? ArrowRightFromLine : ArrowLeftFromLine}
              className={` ${
                Platform.OS === 'web' ? 'w-4 h-4' : 'w-5 h-5'
              }`}
            />
          </Button>
        </View>
      )}

      {isMobile && !isCollapsed && (
        <Button
          variant="solid"
          size={Platform.OS === 'web' ? 'md' : 'lg'}
          action="secondary"
          className={`bg-white px-2 border border-[#DFE3E8] rounded-md ${
            Platform.OS === 'web' ? 'h-8' : 'h-10'
          }`}
          onPress={handleTogglePress}
        >
          <ButtonIcon
            as={ArrowLeftFromLine}
            className={Platform.OS === 'web' ? 'w-4 h-4' : 'w-5 h-5'}
          />
        </Button>
      )}
    </View>
  );
};