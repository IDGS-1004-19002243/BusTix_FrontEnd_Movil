import { StyleSheet, ViewStyle, Platform } from 'react-native';
import { COLORS, SIZES } from '../constants';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  rowContainer: {
    flex: 1,
  },
  leftColumn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerWrapper: {
    marginBottom: 16,
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SIZES.scrollPaddingBottom,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: SIZES.maxWidth,
    alignItems: 'center',
  },
  rightColumn: {
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  illustration: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  subtitle: {
    color: COLORS.gray,
  },
});

export const getHeaderStyle = (isMobile: boolean): ViewStyle => {

  return isMobile
    ? {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingTop: Platform.OS==='web'? 0:25,
        backgroundColor: 'transparent',
      }
    : {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'flex-start' as const,
        backgroundColor: 'transparent',
        marginBottom: SIZES.marginBottom,
        alignSelf: 'flex-start' as const,
        width: '100%',
      };
};