import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import styles from "./styles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {getItemsByCategory} from '../../redux/items/actions';
import LoadingBar from "../../components/LoadingBar/LoadingBar";

export default function ItemsListScreen(props) {
  const { navigation, route } = props;
  const { itemsByCategory, isLoading } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const fetchItems = (id) => dispatch(getItemsByCategory(id));
 
  useEffect(() => {
  const item = route?.params?.category;
    fetchItems(item.id);
  }, []);


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
      },
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
        <Text style={styles.category}>Count: {item.quantity}</Text>
        <Text style={styles.category}>{item.category.name}</Text>
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
        <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={itemsByCategory} renderItem={renderItem} keyExtractor={(item) => `${item.id}`} />
      }
    </View>
  );
}
