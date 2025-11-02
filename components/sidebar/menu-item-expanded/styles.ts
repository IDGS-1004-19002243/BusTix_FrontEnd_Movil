
import { StyleSheet } from 'react-native';
import { SIDEBAR_COLORS } from '../constants/sidebar-colors';

export const styles = StyleSheet.create({
  iconActive: {
    color: SIDEBAR_COLORS.iconActive,
  },
  iconInactive: {
    color: SIDEBAR_COLORS.iconInactive,
  },
  container: {
    borderRadius: 8,
    marginLeft: 2,
    marginRight: 0,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 2
  },
  mainButtonActive: {
    backgroundColor: SIDEBAR_COLORS.mainActiveBg,
  },
  mainButtonActiveHovered: {
    backgroundColor: '#C2EADC',
  },
  mainButtonHovered: {
    backgroundColor: SIDEBAR_COLORS.hoverBg,
  },
  mainButtonNormal: {
    backgroundColor: 'transparent',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 32,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'OpenSans',
  },
  labelActive: {
    color: SIDEBAR_COLORS.labelActive,
  },
  labelNormal: {
    color: SIDEBAR_COLORS.labelNormal,
  },
  badge: {
    backgroundColor: SIDEBAR_COLORS.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: SIDEBAR_COLORS.badgeText,
    fontFamily: 'OpenSans',
  },
  chevronWrapper: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
    backgroundColor: 'transparent',
  },
  chevronColor: {
    color: SIDEBAR_COLORS.chevron,
  },
  chevronColorActive: {
    color: SIDEBAR_COLORS.chevronActive,
  },
  submenuContainer: {
    paddingLeft: 15,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
