import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  cardWrapper: {
    marginRight: 12,
    marginBottom: 16,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    height:250, // Adjusted for no image
  },
  cardMobile: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  titleContainer: {
    justifyContent: 'flex-start',
  },
});