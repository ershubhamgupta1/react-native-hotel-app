import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import {useSelector, useDispatch} from 'react-redux';
import {getCategories} from '../../redux/categories/actions';


export default function CategoriesScreen(props) {
  const { navigation } = props;
  const {categories} = useSelector(state => state.categoriesReducer);
  const dispatch = useDispatch();
  const fetchCategories = () => dispatch(getCategories());
  
  useEffect(() => {
    fetchCategories();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
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
    else navigation.navigate("RecipesList", { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(item)}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} alt="Item Image" source={{ uri: item.photo_url || null }} />
        <Text style={styles.categoriesName}>{item.name}</Text>
        <Text style={styles.categoriesInfo}>{item.itemCount} items</Text>
        {/* <Text style={styles.categoriesInfo}>{getNumberOfRecipes(item.id)} items</Text> */}
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList data={categories} renderItem={renderCategory} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
