import React, {useCallback, useState, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements'
import BackButton from "../../components/BackButton/BackButton";
import SelectDropdown from '../../components/DropDown/DropDown'

  const itemQuantityTypes = [
    'Pieces',
    'Kg',
    'Packets'
  ];

const CreateItemScreen = (props) => {
  const [form, setForm] = useState({});
  const { navigation} = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Item',
      headerTitleStyle: {
        fontSize: 16,
      },
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

  const onSubmit = useCallback((formData) => {
  }, []);

  const onChangeField = useCallback((name) => (text) => {
    setForm({...form, [name]: text});
  }, [form]);

  const handleSubmit = ()=>{

  }


  
  return (
    <View style={styles.container}>
      <Input  placeholder='Item name' inputMode='text' returnKeyType='done' onChangeText={onChangeField('name')}/>
      <View>
        <SelectDropdown data={itemQuantityTypes} onSelect={({selectedItem, index})=>{onChangeField('quantityType')(selectedItem)}} />
      </View>
      <Input disabled={!form.quantityType} placeholder='Quantity' inputMode='decimal' returnKeyType='done' onChangeText={onChangeField('quantity')}/>
      <Button disabled={!form.name || !form.quantity} title="Save" type='outline' color='green' onPress={()=>{handleSubmit()}} titleStyle={styles.submitButton} buttonStyle={styles.submitButton} />
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

export default CreateItemScreen;
