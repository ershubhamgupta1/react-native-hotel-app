import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function DrawerContainer(props) {
  const { navigation } = props;
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="HOME"
          icon={<FontAwesome name="home" size={20}/>}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CATEGORIES"
          icon={<FontAwesome name="list" size={20}/>}
          onPress={() => {
            navigation.navigate("Categories");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="SEARCH"
          icon={<FontAwesome name="search" size={20}/>}
          onPress={() => {
            navigation.navigate("Search");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="STOCK LIST"
          icon={<FontAwesome name="list" size={20}/>}
          onPress={() => {
            navigation.navigate("stockList");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="OUT OF STOCK"
          icon={<FontAwesome name="battery-empty" size={20}/>}
          onPress={() => {
            navigation.navigate("EmptyItems");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CREATE ORDER"
          icon={<FontAwesome name="plus-circle" size={20}/>}
          onPress={() => {
            navigation.navigate("createOrder");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="Logout"
          icon={<FontAwesome name="sign-out" size={20}/>}
          onPress={() => {
            const auth = getAuth();
            signOut(auth);
            navigation.closeDrawer();
          }}
        />
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
