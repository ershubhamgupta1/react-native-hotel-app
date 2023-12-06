import { StyleSheet } from 'react-native';
import { RecipeCard } from '../../AppStyles';

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
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  category: RecipeCard.category
});

export default styles;
