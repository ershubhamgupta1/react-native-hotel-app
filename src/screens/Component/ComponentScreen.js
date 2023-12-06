import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import {useSelector, useDispatch} from 'react-redux';
import {getItemsByComponent} from '../../redux/items/actions';

export default function ComponentScreen(props) {
  const { navigation, route } = props;

  const {id, name, photo_url} = route.params?.component || {};
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

  const onPressItem = (item) => {
    navigation.navigate("Item", { itemId: item.id });
  };

  const renderItem = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressItem(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url || null }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category.name}</Text>
      </View>
    </TouchableHighlight>
  );
  return (
    <View style={styles.mainContainer}>
      <View style={{ borderBottomWidth: 0.4, marginBottom: 10, borderBottomColor: "grey" }}>
        <Image style={styles.photoComponent} source={{ uri: "" + componentUrl || null }} />
      </View>
      <Text style={styles.componentInfo}>Items with {componentName}:</Text>
      <View>
        <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={itemsByComponent} renderItem={renderItem} keyExtractor={(item) => `${item.id}`} />
      </View>
    </View>
  );
}
