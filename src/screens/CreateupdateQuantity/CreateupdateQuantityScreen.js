import React, {  useCallback, useState, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {Text, Input, Button} from 'react-native-elements'
import SelectDropdown from '../../components/DropDown/DropDown'

const itemQuantityTypes = [
    'Pieces',
    'Kg',
    'Packets'
  ];

const FormScreen = (props) => {
  const { navigation, route } = props;
  const [form, setForm] = useState({quantityType: route.params?.quantityType});
  const [isRegistered, setIsRegistered] = useState(false);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Update Quantity',
      headerTitleStyle: {
        fontSize: 16,
      },
    });
  }, []);

  const onSubmit = useCallback((formData) => {
    setIsRegistered(true);
    
  }, []);

  const onChangeField = useCallback((name) => (text) => {
    setForm({...form, [name]: text});
  }, [form]);

  const handleSubmit = ()=>{

  }

  
  return (
    <View style={styles.container}>
      <View>
        <SelectDropdown defaultValue={route.params?.quantityType} data={itemQuantityTypes} onSelect={({selectedItem, index})=>{onChangeField('quantityType')(selectedItem)}} />
      </View>
      <Input disabled={!form.quantityType} placeholder='Quantity' inputMode='decimal' returnKeyType='done' onChangeText={onChangeField('quantity')}/>
      <Button title="Save" type='outline' color='green' onPress={()=>{handleSubmit()}} titleStyle={styles.submitButton} buttonStyle={styles.submitButton} />
      {isRegistered && <Text style={styles.successText}>updated successful!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submitButton: {
    color: 'green',
    borderColor:'green'
  },
  successText: {
    color: 'green',
    marginTop: 10,
    fontSize: 17,
  },
});

export default FormScreen;
