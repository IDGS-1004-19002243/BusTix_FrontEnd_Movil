import { StyleSheet, Platform } from 'react-native';
import { NAVBAR_BG } from '@/components/navbar/constants/navbarColors';

export const navbarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({ // los tres ... del operador de propagación se usa para expandir el objeto retornado por Platform.select
      web: {
        paddingHorizontal: 16,
      },
      default: {
        paddingLeft: 20,
        paddingRight: 16,
      },
    }),
    minHeight: 56,
    backgroundColor: NAVBAR_BG,
  },
  menuButton: {
    ...Platform.select({
      web: {
        padding: 8,
        minWidth: 40,
        minHeight: 40,
      },
      default: {
        padding: 16, 
        minWidth: 48,
        minHeight: 48,
      },
    }),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonPressed: {
    backgroundColor: '#F4F6F8',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  notificationButtonPressed: {
    backgroundColor: '#e2e8f0',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
  userButtonPressed: {
    backgroundColor: '#4f46e5',
  },
  userIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    ...Platform.select({
      web: {
        width: 30,
        height: 30,
      },
      android: {
        width: 28,
        height: 28,
      },
      ios: {
        width: 26,
        height: 26,
      },
    }),
  },
});
