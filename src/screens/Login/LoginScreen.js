import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import PushNotification, {schedulePushNotification} from '../../components/PushNotification/PushNotification';
import { useEffect } from 'react';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }
    useEffect(()=>{
        schedulePushNotification()
    }, [])

    const onLoginPress = async () => {
        try{
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            // const uid = userCredential.user.uid;
            // const docRef = doc(db, "users", uid);
            // const docSnap = await getDoc(docRef);
            // const user = docSnap.data();
        }
        catch(error){
            console.log('error======', error);
            if(error.code.includes('auth/invalid-login-credentials')) alert('Invalid Credentials!');
            else if(error.code.includes('auth/invalid-email')) alert('Invalid Email!');
            else alert(error.message);

        }
    }

    return (
        
        <View style={styles.container}>
            <PushNotification />
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    disabled={!email || !password}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}