import { StyleSheet } from "react-native";
import { RecipeCard } from "../../AppStyles";

const styles = StyleSheet.create({
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  emptyItemMsgContainer: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    height: '100%',
  },
  emptyItemMsg: {
    textAlign: 'center',
    color: '#000000',
  },
});

export default styles;
