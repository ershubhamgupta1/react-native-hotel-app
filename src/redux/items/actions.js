import { GET_ITEMS, GET_ITEMS_BY_CATEGORY, GET_ITEMS_BY_COMPONENT, GET_EMPTY_ITEMS, GET_ITEMS_COUNT } from './actionTypes';
import { collection, query, where, getDocs, doc, documentId, setDoc, getCountFromServer } from "firebase/firestore";
import { db } from '../../firebase/config.js';

const addCategoryAndComponentsInItem = async(querySnapshot)=>{
  let items = [];
  if(querySnapshot.empty) return [];
  const itemsByCategory = {};
  const categoryIds = [];
  querySnapshot.forEach((doc) => {
    const componentIds = [];
    const components = [];
    doc.get('components') && doc.get('components').forEach(comp=>{
      componentIds.push(comp.id.id);
      components.push({id: comp.id.id, quantity: comp.quantity})
    })
    categoryIds.push(doc.get('categoryId').id);
    if(!itemsByCategory[doc.get('categoryId').id]){
      itemsByCategory[doc.get('categoryId').id] = {items : [{id: doc.id, ...doc.data(), categoryId: doc.get('categoryId').id, componentIds, components}]};
    } else {
      itemsByCategory[doc.get('categoryId').id].items.push({id: doc.id, ...doc.data(), categoryId: doc.get('categoryId').id, componentIds, components});
    }
  });

  const categoryQuery = query(collection(db, "categories"), where(documentId(), "in", categoryIds));
  const categoryQuerySnapshot = await getDocs(categoryQuery);
  categoryQuerySnapshot.forEach((doc) => {
    const catItems = itemsByCategory[doc.id].items;
    for(let i=0; i < catItems.length; i++){
      catItems[i].category = {id: doc.id, ...doc.data()};
    }
    itemsByCategory[doc.id] = catItems;
    items = items.concat(catItems);
  });
  return items;
}

export const getItems = () => {
    try {
      return async dispatch => {
        const q = query(collection(db, "items"));
        const querySnapshot = await getDocs(q);
        const items = await addCategoryAndComponentsInItem(querySnapshot);
        dispatch({
          type: GET_ITEMS,
          payload: items,
        });
      };
    } catch (error) {
        console.log('got error in fetching items------', error);
        alert(error);
    }
};

export const getItemsByCategory = (categoryId) => {

  try {
    return async dispatch => {
      const categoryDocRef = doc(db, "categories", categoryId);
      const q = query(collection(db, "items"), where("categoryId", "==", categoryDocRef));

      const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //     items.push({id: doc.id, ...doc.data()});
      //   });
      const items = await addCategoryAndComponentsInItem(querySnapshot);
      dispatch({
        type: GET_ITEMS_BY_CATEGORY,
        payload: items,
      });
    };
  } catch (error) {
      alert(error);
  }
};
  
export const getItemsByComponent = (componentId) => {
  try {
    return async dispatch => {
      const q = query(collection(db, "items"), where('componentIds', "array-contains", componentId));
      const querySnapshot = await getDocs(q);
      const items = await addCategoryAndComponentsInItem(querySnapshot);

      dispatch({
          type: GET_ITEMS_BY_COMPONENT,
          payload: items,
        });
    };
  } catch (error) {
      alert(error);
  }
};

export const getEmptyItems = () => {
  try {
    return async dispatch => {
      const q = query(collection(db, "items"), where('quantity', "<=", 0));
      const querySnapshot = await getDocs(q);
      const items = await addCategoryAndComponentsInItem(querySnapshot);
      dispatch({
        type: GET_EMPTY_ITEMS,
        payload: items,
      });
    };
  } catch (error) {
      console.log('got error in fetching items------', error);
      alert(error);
  }
};

export const getItemsCount = () => {
  try {
    return async dispatch => {
      const q = query(collection(db, "items"));
      
      const querySnapshot = await getCountFromServer(q);
      const count = querySnapshot.data().count;
      dispatch({
        type: GET_ITEMS_COUNT,
        payload: {count: count},
      });
    };
  } catch (error) {
      console.log('got error in fetching items count------', error);
      alert(error);
  }
};

export const createUpdateItem = (payload, callback) => {
  return async dispatch => {
    try{
      console.log('payload==========', typeof payload.id);
      const docRef = doc(db, "items", payload.id);
      console.log('payload.categoryId==========', payload.categoryId);

      payload.categoryId = doc(db, 'categories/' + payload.categoryId)

      setDoc(docRef, payload);
      callback();
      // dispatch({
      //     type: GET_ITEMS_BY_COMPONENT,
      //     payload: items,
      //   });
    }
    catch(err){
      console.log('err==========', err);
      alert('Internal server error');

    }
  };
};
