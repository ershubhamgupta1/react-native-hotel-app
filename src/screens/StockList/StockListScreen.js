import React, { useLayoutEffect, useEffect } from "react";
import {Text, View, StyleSheet, ScrollView } from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import BackButton from "../../components/BackButton/BackButton";
import {getItems} from '../../redux/items/actions';
import { Table, Row } from 'react-native-table-component';

export default function ItemCostCalculateScreen(props) {
  const { navigation } = props;
  const { items } = useSelector(state => state.itemsReducer);

  const dispatch = useDispatch();
  const fetchItems = () => dispatch(getItems());
  useEffect(() => {
    fetchItems();
  }, []);

  const cols = ['title', 'quantity', 'quantityType', 'costPerUnit', 'sellingPricePerUnit'];
  const colsLabel = ['Item name', 'QTY.', 'Measurement', 'Rate', 'Sale Price'];


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Stock List',
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

  const widthArr = [120, 40, 50, 70, 70];
  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: '20', fontWeight: 'bold'}}>Total stock value : {totalCost} Rs</Text>
    <ScrollView horizontal={true}>
      <View>
        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
          <Row data={colsLabel} widthArr={widthArr} style={styles.header} textStyle={{...styles.text, fontWeight: 'bold'}}/>
        </Table>
        <ScrollView style={styles.dataWrapper}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            {
              tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={widthArr}
                  style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                  textStyle={styles.text}
                />
              ))
            }
          </Table>
        </ScrollView>
      </View>
    </ScrollView>
  </View>  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});