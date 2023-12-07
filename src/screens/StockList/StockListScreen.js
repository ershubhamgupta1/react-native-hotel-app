import React, { useLayoutEffect, useEffect } from "react";
import {Text, View, StyleSheet, ScrollView,  } from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import {getItems} from '../../redux/items/actions';
import MenuImage from "../../components/MenuImage/MenuImage";

export default function ItemCostCalculateScreen(props) {
  const { navigation } = props;
  const { items } = useSelector(state => state.itemsReducer);


  const dispatch = useDispatch();
  const fetchItems = () => dispatch(getItems());
  useEffect(() => {
    fetchItems();
  }, []);

  const cols = ['title', 'quantity', 'quantityType', 'costPerUnit', 'sellingPricePerUnit'];
  const flexArr = [4,2,2,2,2];
  const colsLabel = ['Item name', 'QTY.', 'Meas.', 'Rate', 'Sale Price'];


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const tableData = [];
  let totalCost = 0;

  for (let i = 0; i < items.length; i++) {
    const {quantity, costPerUnit} = items[i];
    if(quantity && costPerUnit) totalCost +=  quantity * costPerUnit;
    const rowData = [];
    for(let key in cols){
      if(items[i].hasOwnProperty(cols[key])) rowData.push(items[i][cols[key]]);
      else rowData.push('');
    }
    tableData.push(rowData);
  }

  const renderTableHeader = ()=>{
    return (
      <View>
        <View style={styles.header}>
          {
            colsLabel.map((col, i)=>{
              return (
                <View key={i} style={{flex: flexArr[i]}}>
                  <Text> {col} </Text>
                </View>
              )
            })
          }
        </View>
    </View>
    )
  };

  const renderTableData = ()=>{
    return (
      <View>
      {
        tableData.map((rowData, index) => {
          return (
            <View
              key={index}
              style={[styles.data, index%2 && {backgroundColor: '#F7F6E7'}]}
              >
              {
                rowData.map((col, i)=>{
                  return (
                    <View key={i} style={{flex: flexArr[i], textAlign: 'center', alignItems: 'center'}}>
                      <Text>{col} </Text>
                    </View>
                  )
                })
              }
            </View>
          )
        })
      }
    </View>
    )
  };

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>Total stock value : {totalCost} Rs</Text>
      <View style={styles.container}>
      <View>
        {renderTableHeader()}
      </View>
      <ScrollView style={{flex: 1}}>
        {renderTableData()}
      </ScrollView>
      </View>
  </View>  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, paddingTop: 30, backgroundColor: '#fff' },
  header: { flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'center', borderWidth: 1, borderColor: 'grey',  alignSelf: 'stretch', flexDirection: 'row' , backgroundColor: '#C1C0B9' , padding: 10, minHeight:40 },
  data: {borderWidth: 1, borderColor: 'grey',  alignSelf: 'stretch', flexDirection: 'row' , backgroundColor: '#E7E6E1' , padding: 10},
  text: { textAlign: 'center', fontWeight: '100', flexShrink: 1 },
  dataWrapper: { marginTop: -1 },
  row: { height: 80, backgroundColor: '#E7E6E1', display: 'flex', alignSelf: 'stretch', overflow: 'unset' }
});
