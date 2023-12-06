import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, RefreshControl, ActivityIndicator, Dimensions } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import {useSelector, useDispatch} from 'react-redux';
import {getItems} from '../../redux/items/actions';

import { useHeaderHeight } from '@react-navigation/elements';
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_HEIGHT = width > height ? width : height;

export default function HomeScreen(props) {
  const { navigation } = props;
  const { items, isLoading } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
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

  const onPressRecipe = (item) => {
    // navigation.navigate("Recipe", { item });
    navigation.navigate("Recipe", { itemId: item.id });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
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
        <View style={{justifyContent: 'center', alignItems:'center', height: SCREEN_HEIGHT-headerHeight}}>
          <ActivityIndicator />
        </View>
      }
      {
        !isLoading &&
        <FlatList 
          refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
          vertical 
          showsVerticalScrollIndicator={false} 
          numColumns={2} 
          data={items} 
          renderItem={renderRecipes} 
          keyExtractor={(item) => `${item.id}`} 
        />
      } 

    </View>
  );
}
