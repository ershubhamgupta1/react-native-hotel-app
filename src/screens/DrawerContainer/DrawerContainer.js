import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


export default function DrawerContainer(props) {
  const { navigation } = props;
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="HOME"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CATEGORIES"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("Categories");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="SEARCH"
          source={require("../../../assets/icons/search.png")}
          onPress={() => {
            navigation.navigate("Search");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="OUT OF STOCK"
          source={require("../../../assets/icons/warning.png")}
          onPress={() => {
            navigation.navigate("EmptyItems");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CREATE ORDER"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("createOrder");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="Logout"
          source={require("../../../assets/icons/logout.png")}
          onPress={() => {
            const auth = getAuth();
            signOut(auth);
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="STOCK LIST"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("stockList");
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
