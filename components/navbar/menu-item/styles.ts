import { StyleSheet } from 'react-native';

export const navbarMenuItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
});
