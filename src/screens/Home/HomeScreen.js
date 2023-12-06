import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, RefreshControl } from "react-native";
import styles from "./styles";

import MenuImage from "../../components/MenuImage/MenuImage";
import {useSelector, useDispatch} from 'react-redux';
import {getItems} from '../../redux/items/actions';
import LoadingBar from "../../components/LoadingBar/LoadingBar";


export default function HomeScreen(props) {
  const { navigation } = props;
  const { items, isLoading } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchItems = () => dispatch(getItems());
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchItems();
  }, []);

  useEffect(()=>{
    if(!isLoading) setRefreshing(false);
  }, [isLoading]);

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
        <Image style={styles.photo} source={{ uri: item.photo_url || null}} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.title}>{item.category.name}</Text>
      </View>
    </TouchableHighlight>
  );
  return (
    <View>
      {isLoading &&
        <LoadingBar />
      }
      {
        !isLoading &&
        <FlatList 
          refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
          vertical 
          showsVerticalScrollIndicator={false} 
          numColumns={2} 
          data={items} 
          renderItem={renderItem} 
          keyExtractor={(item) => `${item.id}`} 
        />
      } 

    </View>
  );
}
