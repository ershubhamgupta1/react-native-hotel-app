import React, { useEffect, useLayoutEffect } from "react";
import { FlatList, View, Image, TouchableHighlight } from "react-native";
import { Text} from 'react-native-elements'

import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import {useSelector, useDispatch} from 'react-redux';
import {getEmptyItems} from '../../redux/items/actions';

export default function EmptyItemScreen(props) {
  const { navigation } = props;

  const { emptyItems } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const fetchItems = () => dispatch(getEmptyItems());
  
  useEffect(() => {
    fetchItems();
  }, []);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
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
        <Text style={styles.title}>{item.category.name}</Text>
      </View>
    </TouchableHighlight>
  );
  if(emptyItems.length === 0) return (
    <View style={styles.emptyItemMsgContainer}>
          <Text style={styles.emptyItemMsg}>
            No empty items
          </Text>
        </View>
  )  
  return (
    <View>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={emptyItems} renderItem={renderItem} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
