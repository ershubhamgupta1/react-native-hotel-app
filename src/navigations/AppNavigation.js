import React, {useEffect, useState} from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer' 

import DrawerContainer from '../screens/DrawerContainer/DrawerContainer';
import Header from '../components/Header/Header';

import HomeScreen from '../screens/Home/HomeScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import ItemScreen from '../screens/Item/itemScreen';

import ComponentsDetailsScreen from '../screens/ComponentsDetails/ComponentsDetailsScreen';
import ItemsListScreen from '../screens/ItemList/ItemListScreen';

import ComponentScreen from '../screens/Component/ComponentScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import CreateItemScreen from '../screens/CreateItem/CreateItemScreen';

import ItemCostCalculateScreen from '../screens/ItemCostCalculate/ItemCostCalculate';
import StockListScreen from '../screens/StockList/StockListScreen';
import createOrderScreen from '../screens/CreateOrder/CreateOrderScreen';

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
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerTitle: (props) => <Header {...props} title='Home' /> }} />
        <Stack.Screen name='Categories' component={CategoriesScreen} options={{ headerTitle: (props) => <Header {...props} title='Categories' /> }}/>
        <Stack.Screen name='Item' component={ItemScreen} options={{ headerTitle: (props) => <Header {...props} title='Item' /> }}/>
        <Stack.Screen name='ItemsList' component={ItemsListScreen} options={{ headerTitle: (props) => <Header {...props} title='Item List' /> }}/>
        <Stack.Screen name='Component' component={ComponentScreen} options={{ headerTitle: (props) => <Header {...props} title='Component' /> }}/>
        <Stack.Screen name='Search' component={SearchScreen} options={{ headerTitle: (props) => <Header {...props} title='Search' /> }}/>
        <Stack.Screen name='ComponentDetails' component={ComponentsDetailsScreen} options={{ headerTitle: (props) => <Header {...props}/> }}/>
        <Stack.Screen name='createOrder' component={createOrderScreen} options={{ headerTitle: (props) => <Header {...props} title='Create Order' /> }}/>
        <Stack.Screen name='createItem' component={CreateItemScreen} options={{ headerTitle: (props) => <Header {...props} /> }}/>
        <Stack.Screen name='EmptyItems' component={EmptyItemsScreen} options={{ headerTitle: (props) => <Header {...props} title='Out of stock items' /> }}/>
        <Stack.Screen name='itemCostCalculate' component={ItemCostCalculateScreen} options={{ headerTitle: (props) => <Header {...props} /> }}/>
        <Stack.Screen name='stockList' component={StockListScreen} options={{ headerTitle: (props) => <Header {...props} title='Stock List' /> }}/>
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