import { StyleSheet } from 'react-native';
import { ItemCard } from '../../AppStyles';

const styles = StyleSheet.create({
  photoComponent: {
    width: '100%',
    height: 250,
    alignSelf: 'center'
  },
  componentInfo: {
    color: 'black',
    marginLeft: 20,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  container: ItemCard.container,
  photo: ItemCard.photo,
  title: ItemCard.title,
  category: ItemCard.category
});

export default styles;
