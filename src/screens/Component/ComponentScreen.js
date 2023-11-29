import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, ScrollView, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import { getCategoryName } from "../../data/MockDataAPI";
import {useSelector, useDispatch} from 'react-redux';
import {getItemsByComponent} from '../../redux/items/actions';

export default function IngredientScreen(props) {
  const { navigation, route } = props;

  const {id, name, photo_url} = route.params?.ingredient || {};
  const componentUrl = photo_url;
  const componentName = name;

  const { itemsByComponent } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const fetchItems = (id) => dispatch(getItemsByComponent(id));
  
  useEffect(() => {
    fetchItems(id);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.name,
    });
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
        <View style={styles.container}>
          <Image style={styles.photo} source={{ uri: item.photo_url }} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{item.category.name}</Text>
        </View>
      </TouchableHighlight>
    </TouchableHighlight>
  );
  return (
    <View style={styles.mainContainer}>
      <View style={{ borderBottomWidth: 0.4, marginBottom: 10, borderBottomColor: "grey" }}>
        <Image style={styles.photoComponent} source={{ uri: "" + componentUrl }} />
      </View>
      <Text style={styles.componentInfo}>Items with {componentName}:</Text>
      <View>
        <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={itemsByComponent} renderItem={renderRecipes} keyExtractor={(item) => `${item.id}`} />
      </View>
    </View>
  );
}
