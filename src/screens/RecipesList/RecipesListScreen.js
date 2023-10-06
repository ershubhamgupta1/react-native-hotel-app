import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import styles from "./styles";
import { getRecipes, getCategoryName } from "../../data/MockDataAPI";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {getItemsByCategory} from '../../redux/items/actions';

export default function RecipesListScreen(props) {
  const { navigation, route } = props;
  const { itemsByCategory } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const fetchItems = (id) => dispatch(getItemsByCategory(id));
  
  useEffect(() => {
  const item = route?.params?.category;
    fetchItems(item.id);
  }, []);

  const item = route?.params?.category;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
      headerRight: () => {
        return (
          <View style={{marginRight: 15}}>
          <TouchableHighlight onPress={()=>{
            navigation.navigate("createItem", { });
          }}>
            <FontAwesome name={'plus'} color={'green'} size={22} />
          </TouchableHighlight>
          </View>
        )
      } 
      ,
    });
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };
console.log('itemsByCategory======', itemsByCategory);
  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>Count: {item.quantity}</Text>
        <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={itemsByCategory} renderItem={renderRecipes} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
