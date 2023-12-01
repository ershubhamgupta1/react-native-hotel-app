import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import { Text, View, Image, TouchableHighlight } from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import BackButton from "../../components/BackButton/BackButton";
import {getItems, updateComponentsForItem} from '../../redux/items/actions';
import SelectDropdown from '../../components/DropDown/DropDown'
import styles from "./styles";
import {Modal} from "../../components/Modal/Modal";
import {Input, Button, ListItem, Avatar} from 'react-native-elements'

export default function ItemCostCalculateScreen(props) {
  const { navigation, route } = props;
  const {components: componentsProp, title, itemId} = route?.params;
  const { items } = useSelector(state => state.itemsReducer);
  const [currentItem, setCurrentItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [components, setComponents] = useState(componentsProp);

  console.log('currentItem=========', currentItem);

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
    if(name === 'quantity') setCurrentItem({...currentItem, quantity: text.replace('(?<=^| )\d+\.\d+(?=$| )', '')});
    else setCurrentItem({...currentItem, [name]: text});
  }, [currentItem]);

  const itemIndex = items.findIndex(i=> i.id === currentItem.itemId);

  return (
    <View>
      <Text style={styles.textStyle}>Total Cost : {totalCost} Rs</Text>
      <View>
        {
            components.map((l, i) => (
              <TouchableHighlight key={i} onPress={()=>{
                setCurrentItem({...currentItem, ...l})
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
            <Modal.Header fontSize={16} textStyle={{fontSize: 16, marginBottom: 10}} title="Update Quantity" />
            <Modal.Body>
              <SelectDropdown defaultButtonText='Select Component' defaultValueByIndex={itemIndex} data={items} renderSelectLabel={(item)=>item.title} renderDropDown={(item)=> item.title} onSelect={({selectedItem, index})=>{
                onChangeField('currentItem')({id: selectedItem.id, quantityType: selectedItem.quantityType});
              }} />
              <Text>Quantity Type : {currentItem && currentItem.quantityType} </Text>
               <Text>Quantity :</Text> 
               <Input disabled={!(currentItem && currentItem.quantityType)}  inputMode='decimal' value={currentItem.quantity + ''} placeholder='Quantity' returnKeyType='done' onChangeText={(value)=>{
                onChangeField('quantity')(value)
              }}/>

              </Modal.Body>
            <Modal.Footer>
            <Button type="outline" buttonStyle={{borderColor: '#2cd18a'}} titleStyle={{color: '#2cd18a'}} style={{marginRight: 10}} title='Cancel' onPress={()=>{
                setModalVisible(false);
                setCurrentItem({});
              }} />
              <Button type="outline" buttonStyle={{borderColor: '#2cd18a'}} titleStyle={{color: '#2cd18a'}} style={{marginRight: 10}} disabled={!currentItem.quantity} title='Update' onPress={()=>{
                let tempComponents = JSON.parse(JSON.stringify(components));
                tempComponents = tempComponents.map(comp=> {
                  if(comp.id == currentItem.itemId) comp = {...comp, quantity:  parseFloat(currentItem.quantity)};
                  return comp;
                });
                setComponents(tempComponents);
                setCurrentItem({});
                dispatch(updateComponentsForItem({itemId: itemId, components: tempComponents, totalCost}))
                setModalVisible(false);
              }} />
            </Modal.Footer>
          </Modal.Container>
        </Modal>
      </View>
    </View>
  );
}

