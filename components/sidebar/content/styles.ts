import { StyleSheet } from 'react-native';
import { SIDEBAR_COLORS } from '../constants/sidebar-colors';

export const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionContainerFirst: {
    marginTop: 0,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 4,
    paddingVertical: 4,
    fontSize: 10.5,
    color: SIDEBAR_COLORS.sectionTitle,
    fontFamily: 'OpenSans',
  },
  menuItemWrapper: {
    alignItems: 'center',
    paddingVertical: 4,
    marginVertical: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 4,
    backgroundColor: SIDEBAR_COLORS.bg,
  },

  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 65,
    height: 65,
    marginRight: 1,
  },
  logoText: {
    fontSize: 18.5,
    fontWeight: 'bold',
    color: SIDEBAR_COLORS.logoText,
  },
  toggleButton: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: SIDEBAR_COLORS.border,
  },
  toggleButtonPressed: {
    backgroundColor: SIDEBAR_COLORS.togglePressed,
  },

});
