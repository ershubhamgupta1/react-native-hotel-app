import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, RefreshControl } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import {useSelector, useDispatch} from 'react-redux';
import {getCategories} from '../../redux/categories/actions';
import LoadingBar from "../../components/LoadingBar/LoadingBar";


export default function CategoriesScreen(props) {
  const { navigation } = props;
  const {categories, isLoading} = useSelector(state => state.categoriesReducer);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  const fetchCategories = () => dispatch(getCategories());
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCategories();
  }, []);

  useEffect(()=>{
    if(!isLoading) setRefreshing(false);
  }, [isLoading]);

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

  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    if(!item.itemCount) alert('No item found!') 
    else navigation.navigate("ItemsList", { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(item)}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} alt="Item Image" source={{ uri: item.photo_url || null }} />
        <Text style={styles.categoriesName}>{item.name}</Text>
        <Text style={styles.categoriesInfo}>{item.itemCount} items</Text>
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
          data={categories} 
          renderItem={renderCategory} 
          keyExtractor={(item) => `${item.id}`} 
        />
      }
    </View>
  );
}
