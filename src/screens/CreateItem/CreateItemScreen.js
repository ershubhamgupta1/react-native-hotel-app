import React, {useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, ScrollView , SafeAreaView} from 'react-native';
import { Input, Button } from 'react-native-elements'
import BackButton from "../../components/BackButton/BackButton";
import SelectDropdown from '../../components/DropDown/DropDown'
import {useSelector, useDispatch} from 'react-redux';
import {createUpdateItem, getItemsCount} from '../../redux/items/actions';
import {getCategories} from '../../redux/categories/actions';

  const itemQuantityTypes = [
    'Pieces',
    'Kg',
    'Packets'
  ];

const CreateItemScreen = (props) => {
  const { navigation, route } = props;
  const {item} = route.params;
  let initFormState = {};
  if(item && item.id){
    const {title, id, photo_url, photosArray, category, quantityType, quantity, time, minQuantityForAlert, costPerUnit, sellingPricePerUnit, description} = item;
    if(photosArray && photosArray.length){
    const [photo_url1, photo_url2, photo_url3] = photosArray;
    if(photo_url1) initFormState.photo_url1 = photo_url1;
    if(photo_url2) initFormState.photo_url2 = photo_url2;
    if(photo_url3) initFormState.photo_url3 = photo_url3;
    }
    if(title) initFormState.title = title;
    if(id) initFormState.id = id;
    if(photo_url) initFormState.photo_url = photo_url;

    if(category && category.id) initFormState.categoryId = category.id;
    if(category) initFormState.category = category;
    if(quantityType) initFormState.quantityType = quantityType;
    
    if(time) initFormState.time = time;
    if(quantity) initFormState.quantity = quantity;
    if(minQuantityForAlert) initFormState.minQuantityForAlert = minQuantityForAlert;
    
    if(costPerUnit) initFormState.costPerUnit = costPerUnit;
    if(sellingPricePerUnit) initFormState.sellingPricePerUnit = sellingPricePerUnit;
    if(description) initFormState.description = description;
  }
  const dispatch = useDispatch();
  const [form, setForm] = useState(initFormState);

  const insertUpdateItem = (payload, callback) => dispatch(createUpdateItem(payload, callback));
  const fetchCategories = () => dispatch(getCategories());
  const getCount = () => dispatch(getItemsCount());
  
  const { totalItemsCount } = useSelector(state => state.itemsReducer);
  const {categories} = useSelector(state => state.categoriesReducer);
  
  useEffect(() => {

    if(!item) getCount();
    fetchCategories();

  }, []);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: item && item.id ? 'Update Item' : 'Create Item',
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

  const onChangeField = useCallback((name) => (text) => {
    setForm({...form, [name]: text});
  }, [form]);

  const handleSubmit = useCallback(() => {
    const photosArray = [];
    const { id, title, photo_url='', photo_url1, photo_url2, photo_url3, quantity, quantityType, time='', categoryId, description='', costPerUnit, sellingPricePerUnit, minQuantityForAlert } = form;
    if(photo_url) photosArray.push(photo_url);
    if(photo_url1) photosArray.push(photo_url1);
    if(photo_url2) photosArray.push(photo_url2);
    if(photo_url3) photosArray.push(photo_url3);
    const payload = {
      isNewRec : id ? false: true,
      id: Number(id),
      title,
      photo_url,
      description,
      photosArray,
      quantity: Number(quantity),
      minQuantityForAlert: Number(minQuantityForAlert),
      quantityType,
      time,
      categoryId,
      costPerUnit: Number(costPerUnit),
      sellingPricePerUnit: sellingPricePerUnit ? Number(sellingPricePerUnit) : 0,
    };
    if(!id) payload.id = totalItemsCount+1;

    insertUpdateItem(payload, ()=>{
      if(!id) alert('Item created successfully!');
      else alert('Item updated successfully!');
      navigation.navigate("Categories");
    });
  }, [form]);
  return (
    <ScrollView contentContainerStyle={styles.container} automaticallyAdjustKeyboardInsets={true}>
      <SafeAreaView>
        <SelectDropdown defaultButtonText='Select category' defaultValue={form.category} data={categories} renderSelectLabel={(item)=>item.name} renderDropDown={(item)=> item.name} onSelect={({selectedItem, index})=>{onChangeField('categoryId')(selectedItem.id)}} />
        <SelectDropdown defaultButtonText='Select quantity type' defaultValue={form.quantityType} renderSelectLabel={(item)=>item} renderDropDown={(item)=>item} data={itemQuantityTypes} onSelect={({selectedItem, index})=>{onChangeField('quantityType')(selectedItem)}} />
        <Input label='Item name' inputMode='text' value={form.title} returnKeyType='done' onChangeText={onChangeField('title')}/>
        <Input disabled={!form.quantityType} label='Quantity' inputMode='decimal' value={form.quantity && form.quantity.toString()} returnKeyType='done' onChangeText={(value)=>{onChangeField('quantity')(value)}}/>
        <Input disabled={!form.quantityType} label='Min quantity for alert' inputMode='decimal' value={form.minQuantityForAlert && form.minQuantityForAlert.toString()} returnKeyType='done' onChangeText={(value)=>{onChangeField('minQuantityForAlert')(value)}}/>
        <Input disabled={!form.quantityType} label='Cost per unit' inputMode='decimal' value={form.costPerUnit && form.costPerUnit.toString()} returnKeyType='done' onChangeText={(value)=>{onChangeField('costPerUnit')(value)}}/>
        <Input disabled={!form.quantityType} label='Selling Price' inputMode='decimal' value={form.sellingPricePerUnit && form.sellingPricePerUnit.toString()} returnKeyType='done' onChangeText={(value)=>{onChangeField('sellingPricePerUnit')(value)}}/>
        <Input disabled={!form.quantityType} label='Time' inputMode='text' value={form.time} returnKeyType='done' onChangeText={onChangeField('time')}/>
        <Input disabled={!form.quantityType} label='Main Photo Url' inputMode='text' value={form.photo_url} returnKeyType='done' onChangeText={onChangeField('photo_url')}/>
        <Input disabled={!form.quantityType} label='Photo Url 1' inputMode='text' value={form.photo_url1} returnKeyType='done' onChangeText={onChangeField('photo_url1')}/>
        <Input disabled={!form.quantityType} label='Photo Url 2' inputMode='text' value={form.photo_url2} returnKeyType='done' onChangeText={onChangeField('photo_url2')}/>
        <Input disabled={!form.quantityType} label='Photo Url 3' inputMode='text' value={form.photo_url3} returnKeyType='done' onChangeText={onChangeField('photo_url3')}/>
        <Input disabled={!form.quantityType} label='Description' inputMode='text' value={form.description} returnKeyType='done' onChangeText={onChangeField('description')}/>
        <Button disabled={!form.title || !form.quantity} title="Save" type='outline' onPress={()=>{handleSubmit()}} titleStyle={styles.buttonTitleStyle} buttonStyle={styles.buttonStyle} />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  buttonStyle: {
    borderColor:'#2cd18a',
    borderRadius: 50,
    borderWidth: 1
  },
  buttonTitleStyle: {
    color: '#2cd18a',
  },

  successText: {
    color: 'green',
    marginTop: 10,
    fontSize: 17,
  },
});

export default CreateItemScreen;
