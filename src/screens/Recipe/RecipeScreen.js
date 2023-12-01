import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import styles from "./styles";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BackButton from "../../components/BackButton/BackButton";
import ViewIngredientsButton from "../../components/ViewButton/ViewButton";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width: viewportWidth } = Dimensions.get("window");

export default function RecipeScreen(props) {
  const { navigation, route } = props;
  const item = route.params?.item;
  const {id: itemId, componentIds, components, title, category, sellingPricePerUnit=0, costPerUnit=0, time,
  quantityType, photosArray, description} = item;
  const catTitle = category.name;


  const [activeSlide, setActiveSlide] = useState(0);

  const slider1Ref = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.carousel}>
          <Carousel
            ref={slider1Ref}
            data={photosArray}
            renderItem={renderImage}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            firstItem={0}
            loop={false}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => setActiveSlide(0)}
          />
          <Pagination
            dotsLength={photosArray.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotColor="rgba(255, 255, 255, 0.92)"
            dotStyle={styles.paginationDot}
            inactiveDotColor="white"
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={slider1Ref.current}
            tappableDots={!!slider1Ref.current}
          />
        </View>
      </View>
      <View style={styles.infoRecipeContainer}>
        <Text style={styles.infoRecipeName}>{title}</Text>
        <View style={styles.infoContainer}>
          <TouchableHighlight
            onPress={() =>
              navigation.navigate("RecipesList", { category, title: catTitle })
            }
          >
            <Text style={styles.category}>
              {catTitle}
            </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.infoContainer}>
          <Image
            style={styles.infoPhoto}
            source={require("../../../assets/icons/time.png")}
          />
          <Text style={styles.infoRecipe}>{time} </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoRecipe}>Cost Price: <FontAwesome name={'rupee'} color={'black'} size={12} />{costPerUnit}/{quantityType} </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoRecipe}>Selling Price : <FontAwesome name={'rupee'} color={'black'} size={12} />{sellingPricePerUnit}/{quantityType} </Text>
        </View>

        <View style={styles.infoContainer}>
          <ViewIngredientsButton
            title='Components'
            onPress={() => {
              navigation.navigate("IngredientsDetails", { itemId, componentIds, components, title });
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <ViewIngredientsButton
            title='Update Item'
            onPress={() => {
              navigation.navigate("createItem", {item});
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <ViewIngredientsButton
            title='Calculate Cost'
            onPress={() => {
              if(!componentIds || componentIds.length === 0) alert('Please add components firstly!');
              else {
                navigation.navigate("itemCostCalculate", {itemId, componentIds, components, title});
              }  
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoDescriptionRecipe}>{description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
