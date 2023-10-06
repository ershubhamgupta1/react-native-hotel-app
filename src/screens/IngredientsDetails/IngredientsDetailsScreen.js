import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import { getIngredientName, getAllIngredients } from "../../data/MockDataAPI";
import {useSelector, useDispatch} from 'react-redux';
import {getComponentsByIds} from '../../redux/components/actions';

export default function ComponentsDetailsScreen(props) {
  const { navigation, route } = props;
  let componentsWithQuantity = route?.params?.components;

  const { components } = useSelector(state => state.componentsReducer);
  componentsWithQuantity = componentsWithQuantity.map(comp=>{
    const tempComp = components.find(o=> o.id === comp.id);
    comp = {...comp, ...tempComp};
    return comp;
  })
  const dispatch = useDispatch();
  const fetchItems = (ids) => dispatch(getComponentsByIds(ids));
  
  useEffect(() => {
  const componentIds = route?.params?.componentIds;
    fetchItems(componentIds);
  }, []);
  const item = route.params?.componentIds;
  // const ingredientsArray = getAllIngredients(item);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
      headerTitleStyle: {
        fontSize: 16,
      },
    });
  }, []);

  const onPressComponent = (item) => {
    let name = getIngredientName(item.ingredientId);
    let ingredient = item.ingredientId;
    navigation.navigate("Ingredient", { ingredient: item });
  };

  const renderComponent = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressComponent(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={{ color: "grey" }}>{item.quantity}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={3} data={componentsWithQuantity} renderItem={renderComponent} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
