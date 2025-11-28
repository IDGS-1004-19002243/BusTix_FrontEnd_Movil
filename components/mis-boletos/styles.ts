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
    height: 380,
  },
  cardMobile: {
    overflow: 'hidden',
    borderRadius: 12, 
    // Como en mobil se muestra una sola columna, no es necesario limitar la altura
  },
  eventImage: {
    width: '100%',
    height: 160, // Reducido de 180 a 160
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleContainer: {
    justifyContent: 'flex-start',
  },
});