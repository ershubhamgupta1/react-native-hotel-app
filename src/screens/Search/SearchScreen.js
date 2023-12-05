import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, Pressable } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { TextInput } from "react-native-gesture-handler";
import {useSelector, useDispatch} from 'react-redux';
import { searchItemsByText } from '../../redux/items/actions';

export default function SearchScreen(props) {
  const { navigation } = props;
  const { searchedItems } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();
  const fetchItems = (text) => dispatch(searchItemsByText(text));

  const [value, setValue] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerTitle: () => (
        <View style={styles.searchContainer}>
          <Image style={styles.searchIcon} source={require("../../../assets/icons/search.png")} />
          <TextInput
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={value}
          />
          <Pressable onPress={() => handleSearch("")}>
          <Image style={styles.searchIcon} source={require("../../../assets/icons/close.png")} />
          </Pressable>
        </View>
      ),
      headerRight: () => <View />,
    });
  }, [value]);

  useEffect(() => {}, [value]);

  const handleSearch = (text) => {
    setValue(text);
    if (text == "") {
    } else if(text.length >= 3) {
      fetchItems(text);
    }
  };

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { itemId: item.id });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
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
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={value.length > 0 ? searchedItems : []} renderItem={renderRecipes} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
