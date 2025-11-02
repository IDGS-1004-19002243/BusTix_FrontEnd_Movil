  import { StyleSheet } from 'react-native';
  import { SIDEBAR_COLORS } from '../constants/sidebar-colors';

  export const styles = StyleSheet.create({
    subMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 30,
      borderRadius: 6,
      marginVertical: 2,
    },
    subMenuItemActive: {
      backgroundColor: SIDEBAR_COLORS.ActiveBgSub,
    },
    subMenuItemHovered: {
      backgroundColor: SIDEBAR_COLORS.hoverBg,
    },
    subMenuItemNormal: {
      backgroundColor: 'transparent',
    },
    subMenuItemLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: SIDEBAR_COLORS.labelNormal,
      fontFamily: 'OpenSans',
    },
   });
