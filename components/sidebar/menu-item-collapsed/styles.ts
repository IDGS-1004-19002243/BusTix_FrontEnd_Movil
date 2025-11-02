import { StyleSheet } from 'react-native';
import { SIDEBAR_COLORS } from '../constants/sidebar-colors';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  containerActive: {
    backgroundColor: SIDEBAR_COLORS.mainActiveBg,
  },
  containerHovered: {
    backgroundColor: SIDEBAR_COLORS.hoverBg,
  },
  containerNormal: {
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11.5,
    fontFamily: 'OpenSans',
    fontWeight: '400',
    textAlign: 'center',
  },
  labelActive: {
    color: SIDEBAR_COLORS.labelActive,

  },
  labelNormal: {
    color: SIDEBAR_COLORS.labelNormal,
  },
    iconActive: {
      color: SIDEBAR_COLORS.iconActive,
    },
    iconInactive: {
      color: SIDEBAR_COLORS.iconInactive,
    },
  badge: {
    backgroundColor: SIDEBAR_COLORS.badgeBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: SIDEBAR_COLORS.badgeText,
    fontFamily: 'OpenSans',
  },
});
