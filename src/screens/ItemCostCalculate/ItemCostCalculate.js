import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import { Text, View, Image, TouchableHighlight } from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import BackButton from "../../components/BackButton/BackButton";
import {getItems} from '../../redux/items/actions';
import SelectDropdown from '../../components/DropDown/DropDown'
import styles from "./styles";
import {Modal} from "../../components/Modal/Modal";
import {Input, Button, ListItem, Avatar} from 'react-native-elements'

export default function ItemCostCalculateScreen(props) {
  const { navigation, route } = props;
  const {components, title} = route?.params;
  const { items } = useSelector(state => state.itemsReducer);
  const [form, setForm] = useState({currentItem : {}});
  const [modalVisible, setModalVisible] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  if(components && items && components.length > 0 && items.length > 0){
    for(let i=0 ; i < items.length; i++){

      const compIndex = components.findIndex(comp=> comp.id == items[i].id);

      if(compIndex > -1) {
        components[compIndex].quantityType = items[i].quantityType;
        components[compIndex].title = items[i].title;
        components[compIndex].costPerUnit = items[i].costPerUnit;
        components[compIndex].itemId = items[i].id;

      }
    }
  }

  const dispatch = useDispatch();
  const fetchItems = () => dispatch(getItems());
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let cost = 0;
    for(let i=0; i < components.length; i++){
      const {costPerUnit, quantity} = components[i];
      cost +=  quantity * costPerUnit;
    }
    setTotalCost(cost);
  }, [components]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      // headerRight: () => {
      //   return (
      //     <View style={{marginRight: 15}}>
      //     <TouchableHighlight onPress={()=>{
      //       setModalVisible(true);
      //     }}>
      //       <FontAwesome name={'plus'} color={'green'} size={22} />
      //     </TouchableHighlight>
      //     </View>
      //   )
      // },
    });
  }, []);


  const onChangeField = useCallback((name) => (text) => {
    setForm({...form, [name]: text});
  }, [form]);

  const itemIndex = items.findIndex(i=> i.id === form.currentItem.itemId);

  return (
    <View>
      <Text style={styles.textStyle}>Total Cost : {totalCost} Rs</Text>
      <View>
        {
            components.map((l, i) => (
              <TouchableHighlight key={i} onPress={()=>{
                setForm({...form, currentItem : l})
                setModalVisible(true)
              }}>
                <ListItem bottomDivider>
                    <Avatar source={{uri: l.avatar_url}} />
                    <ListItem.Content>
                      <ListItem.Title>{l.title}</ListItem.Title>
                      <ListItem.Subtitle>{l.quantity} {l.quantityType}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
              </TouchableHighlight>
            ))
        }
      </View>
      <View>
        <Modal isVisible={modalVisible}>
          <Modal.Container>
            <Modal.Header title="Add Component" />
            <Modal.Body>
              <SelectDropdown defaultButtonText='Select Component' defaultValueByIndex={itemIndex} data={items} renderSelectLabel={(item)=>item.title} renderDropDown={(item)=> item.title} onSelect={({selectedItem, index})=>{
                onChangeField('currentItem')({id: selectedItem.id, quantityType: selectedItem.quantityType});
              }} />
              <Text>Quantity Type : {form.currentItem && form.currentItem.quantityType} </Text>
              <Input disabled={!(form.currentItem && form.currentItem.quantityType)}  inputMode='decimal' value={form.currentItem.quantity.toString()} placeholder='Quantity' returnKeyType='done' onChangeText={(value)=>{
                onChangeField('quantity')(value)
              }}/>

              </Modal.Body>
            <Modal.Footer>
            <Button type="outline" buttonStyle={{borderColor: '#2cd18a'}} titleStyle={{color: '#2cd18a'}} style={{marginRight: 10}} title='Cancel' onPress={()=>{
                setModalVisible(false);
              }} />
              <Button type="outline" buttonStyle={{borderColor: '#2cd18a'}} titleStyle={{color: '#2cd18a'}} style={{marginRight: 10}} disabled={!form.quantity} title='Update' onPress={()=>{
                setModalVisible(false);
              }} />
            </Modal.Footer>
          </Modal.Container>
        </Modal>
      </View>
    </View>
  );
}

