import { GET_ITEMS, GET_ITEMS_BY_CATEGORY, GET_ITEMS_BY_COMPONENT, GET_EMPTY_ITEMS, GET_ITEMS_COUNT, GET_ITEM_BY_ID } from './actionTypes';
import { collection, query, where, getDocs, doc, documentId, setDoc, updateDoc, getCountFromServer, writeBatch } from "firebase/firestore";
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
        const docs = querySnapshot.docs;
        const items = await addCategoryAndComponentsInItem(docs);
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
      const docs = querySnapshot.docs;
      const items = await addCategoryAndComponentsInItem(docs);
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
      const docs = querySnapshot.docs;
      const items = await addCategoryAndComponentsInItem(docs);

      dispatch({
          type: GET_ITEMS_BY_COMPONENT,
          payload: items,
        });
    };
  } catch (error) {
      alert(error);
  }
};

const filterEmptyItems = (docs) =>{
  docs = docs.filter((doc) => {
    const {minQuantityForAlert, quantity, title} = doc.data();
    if(quantity <= minQuantityForAlert) return true;
    else return false;
  });
  return docs;
}
export const getEmptyItems = () => {
  try {
    return async dispatch => {
      const q = query(collection(db, "items"), where('minQuantityForAlert', ">=", 0));
      const querySnapshot = await getDocs(q);
      let docs = querySnapshot.docs;
      docs = filterEmptyItems(docs);
      const items = await addCategoryAndComponentsInItem(docs);
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
      const docRef = doc(db, "items", payload.id.toString());
      if(payload.categoryId) payload.categoryId = doc(db, 'categories/' + payload.categoryId)
      if(payload.isNewRec) {
        delete payload.isNewRec;
        await setDoc(docRef, payload);
      }
      else {
        await updateDoc(docRef, payload);

      }
      callback();
    }
    catch(err){
      console.log('err==========', err);
      alert('Internal server error');

    }
  };
};

export const updateMultipleItems = ({items}, callback) => {
  return async dispatch => {
    try{
      const batch = writeBatch(db);
      for(let i=0; i < items.length; i++){
        const docRef = doc(db, "items", items[i].id.toString());
        batch.update(docRef, items[i]);
      }
      batch.commit();
      dispatch(getItems());
      callback();
    }
    catch(err){
      console.log('error in updateMultipleItems=============', err);
      alert('Internal server error');
    }

  }
}

export const updateComponentsForItem = ({itemId, componentIds, components, totalCost}) => {
  try {
    const payload = {};
    if(totalCost) payload.costPerUnit = totalCost;
    if(componentIds) {
      payload.components = componentIds.map(id=>{
        return {
          id: doc(db, 'items/' + id),
          quantity: 0
        }
      });
      payload.componentIds = componentIds;
    }
    if(components) {
      payload.components = components.map(comp=>{
        return {
          id: doc(db, 'items/' + comp.id),
          quantity: comp.quantity 
        }
      });
    } 
    return async dispatch => {
      const docRef = doc(db, "items", itemId.toString());
      updateDoc(docRef, payload);
      dispatch(getItemById(itemId));
    };
  } catch (error) {
      alert(error);
  }
};


export const getItemById = (id) => {
  try {

    return async dispatch => {
      const q = query(collection(db, "items"), where(documentId(), "==", id.toString()));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        const items = await addCategoryAndComponentsInItem(docs);
      dispatch({
        type: GET_ITEM_BY_ID,
        payload: items[0],
      });
    };
  } catch (error) {
      alert(error);
  }
};
