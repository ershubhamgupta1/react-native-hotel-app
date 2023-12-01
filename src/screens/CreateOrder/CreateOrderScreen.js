import React, {  useCallback, useState, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { View, StyleSheet } from 'react-native';

import {Input, Button} from 'react-native-elements'
import SelectDropdown from '../../components/DropDown/DropDown'
import {getItems, updateMultipleItems} from '../../redux/items/actions';


const FormScreen = (props) => {
  const { navigation } = props;
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const { items } = useSelector(state => state.itemsReducer);
  
  const dispatch = useDispatch();
  const fetchItems = () => dispatch(getItems());
  useEffect(() => {
    fetchItems();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Order',
      headerTitleStyle: {
        fontSize: 16,
      },
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const {id: itemId, components} = item;
    const selectedItem = items.find(item=> item.id == itemId);

    const itemsToUpdate = [{id: itemId, quantity: selectedItem.quantity - quantity}];
    
    for(let i=0; i < components.length; i++){
      const {id, quantity: consumedQuantity} = components[i];
      const item = items.find(item=> item.id == id);
      const remainingQuantity = item.quantity - consumedQuantity;
      itemsToUpdate.push({id, quantity: remainingQuantity});
    }
    dispatch(updateMultipleItems({items: itemsToUpdate}, ()=>{
      alert('Order created successfully!');
      navigation.navigate("Home");
    }));

  }, [quantity, item]);

  
  return (
    <View style={styles.container}>
      <View>
      <SelectDropdown defaultButtonText='Select Item' data={items} renderSelectLabel={(item)=>item.title} renderDropDown={(item)=> item.title} onSelect={({selectedItem, index})=>{
        setItem(selectedItem)
      }} />
      </View>
      <Input disabled={!item} placeholder='Quantity' inputMode='decimal' returnKeyType='done' onChangeText={(value)=>{setQuantity(value)}}/>
      <Button title="Save" disabled={!quantity} type='outline' color='green' onPress={()=>{handleSubmit()}} titleStyle={styles.submitButton} buttonStyle={styles.submitButton} />
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
