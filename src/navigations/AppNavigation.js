import React, {useEffect, useState} from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer' 
import HomeScreen from '../screens/Home/HomeScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import DrawerContainer from '../screens/DrawerContainer/DrawerContainer';
import IngredientScreen from '../screens/Ingredient/IngredientScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import IngredientsDetailsScreen from '../screens/IngredientsDetails/IngredientsDetailsScreen';
import CreateItemScreen from '../screens/CreateItem/CreateItemScreen';
import CreateupdateQuantityScreen from '../screens/CreateupdateQuantity/CreateupdateQuantityScreen';
import EmptyItemsScreen from '../screens/EmptyItems/EmptyItems';
import LoginScreen from '../screens/Login/LoginScreen';
import RegistrationScreen from '../screens/Signup/SignupScreen';
import { db } from '../firebase/config';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {Provider} from 'react-redux';
import {store} from '../redux/store';

const Stack = createStackNavigator();

function MainNavigator() {
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, async(userCredential) => {
      if (userCredential) {
        const uid = userCredential.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const user = docSnap.data();
        setUser(user);
        // usersRef
        //   .doc(user.uid)
        //   .get()
        //   .then((document) => {
        //     const userData = document.data()
        //     setLoading(false)
        //     setUser(userData)
        //   })
        //   .catch((error) => {
        //     setLoading(false)
        //   });
      } else {
        setUser(null)
      }
    });
  }, []);

  return(
    <Stack.Navigator
      screenOptions={{
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
          }
      }}
    >


    { user ? (
      <>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Categories' component={CategoriesScreen}/>
        <Stack.Screen name='Recipe' component={RecipeScreen}/>
        <Stack.Screen name='RecipesList' component={RecipesListScreen} />
        <Stack.Screen name='Ingredient' component={IngredientScreen} />
        <Stack.Screen name='Search' component={SearchScreen} />
        <Stack.Screen name='IngredientsDetails' component={IngredientsDetailsScreen} />
        <Stack.Screen name='updateQuantity' component={CreateupdateQuantityScreen} />
        <Stack.Screen name='createItem' component={CreateItemScreen} />
        <Stack.Screen name='EmptyItems' component={EmptyItemsScreen} />
      </>
    ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
      )}
    </Stack.Navigator>
  )
} 



 const Drawer = createDrawerNavigator();

function DrawerStack() {
  return(
    <Drawer.Navigator
      drawerPosition='left'
      initialRouteName='Main'
      drawerStyle={{
        width: 250
      }}
      screenOptions={{headerShown: false}}
      drawerContent={({navigation})=> <DrawerContainer navigation={navigation}/>}
    >
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  )
} 


 export default function AppContainer() {
  return(
    <Provider store={store}>
      <NavigationContainer>
        <DrawerStack/>
      </NavigationContainer>
    </Provider>

  )
} 
 

console.disableYellowBox = true;