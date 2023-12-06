import { StyleSheet } from "react-native";
import { ItemCard } from "../../AppStyles";

const styles = StyleSheet.create({
  container: ItemCard.container,
  photo: ItemCard.photo,
  title: ItemCard.title,
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
