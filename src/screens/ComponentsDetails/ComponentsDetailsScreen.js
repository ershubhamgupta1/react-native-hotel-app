import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import {useSelector, useDispatch} from 'react-redux';
import {getComponentsByIds} from '../../redux/components/actions';
import {getItems,  updateComponentsForItem} from '../../redux/items/actions';
import MultiSelectDropdown from '../../components/MultiDropDown/MultiDropDown'
import BackButton from "../../components/BackButton/BackButton";
import {Button} from 'react-native-elements'

export default function ComponentsDetailsScreen(props) {
  const { navigation, route } = props;
  let {itemId, components: componentsWithQuantityProps, componentIds, title} = route?.params;
  const tempComponentIds = componentIds.map(id => !isNaN(Number(id)) ? Number(id) : id);
  const [selectedComponentIds, setSelectedComponentIds] = useState(tempComponentIds || []);
  const [isEditComp, setIsEditComp] = useState(false);
  const [componentsWithQuantity, setComponentsWithQuantity] = useState(componentsWithQuantityProps);



  const { components } = useSelector(state => state.componentsReducer);
  const { items } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();

  useEffect(()=>{
    const tempComps = [];
    for(let i=0; i < selectedComponentIds.length; i++){
      let comp = items.find(o=> o.id == selectedComponentIds[i]);
      const compWithQuantity = componentsWithQuantity.find(o=> o.id == selectedComponentIds[i]);
      if(compWithQuantity) comp = {...comp, ...compWithQuantity};
      else comp = {...comp, quantity: 0};
      tempComps.push(comp);
    }
    setComponentsWithQuantity(tempComps);
  }, [selectedComponentIds, items])

  const fetchComponentsByIds = (ids) => dispatch(getComponentsByIds(ids));
  const fetchItems = () => dispatch(getItems());

  useEffect(() => {
    fetchItems();
    if(selectedComponentIds && selectedComponentIds.length > 0) fetchComponentsByIds(selectedComponentIds);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title,
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

  const onPressComponent = (item) => {
    navigation.navigate("Component", { component: item });
  };

  const renderComponent = ({ item }) => {
    return (
      <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressComponent(item)}>
        <View style={styles.container}>
          <Image style={styles.photo} source={{ uri: item.photo_url || null}} />
          <Text style={styles.title}>{item.name}</Text>
          <Text style={{ color: "grey" }}>{item.quantity} {item.quantityType}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  return (
    <View>
      {
        isEditComp &&
        <View>
          <MultiSelectDropdown showSelectedItems={true} dropDownStyle={{height: 100}} defaultButtonText='Select Component' displayKey='title' data={items} selectedItems={selectedComponentIds} onSelect={(selectedIds)=>{
            setSelectedComponentIds(selectedIds);
          }} />
          <Button type="outline" buttonStyle={{borderColor: '#2cd18a'}} titleStyle={{color: '#2cd18a'}} style={{marginTop: 20}} title='Update' onPress={()=>{
            const componentIds = selectedComponentIds.map(id => id.toString());
            dispatch(updateComponentsForItem({itemId, componentIds}))
            setIsEditComp(false);

          }} />
        </View>
      }

      {
        !isEditComp && 
        <View>
          <FlatList vertical showsVerticalScrollIndicator={false} numColumns={3} data={componentsWithQuantity} renderItem={renderComponent} keyExtractor={(item) => `${item.id}`} />
          <Button type="outline" buttonStyle={{borderColor: '#2cd18a'}} titleStyle={{color: '#2cd18a'}} style={{marginRight: 10}} title='Edit' onPress={()=>{
            setIsEditComp(true);
          }} />
        </View>  
      }

    </View>
  );
}
