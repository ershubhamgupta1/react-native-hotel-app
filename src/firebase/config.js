import { initializeApp } from 'firebase/app';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBXLMLY4X7hJX_OCe6Zq5jpeDnBYIWfRH0',
  authDomain: 'your-auth-domain-b1234.firebaseapp.com',
  databaseURL: 'https://your-database-name.firebaseio.com',
  projectId: 'react-native-hotel-f182c',
  storageBucket: 'react-native-hotel-f182c.appspot.com',
  messagingSenderId: '12345-insert-yourse',
  appId: '1:1067383523268:ios:cef646c618457b28910691',
};

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  
export { app, auth };