import { GET_ITEMS, GET_ITEMS_BY_CATEGORY, GET_ITEMS_BY_COMPONENT } from './actionTypes';
import { collection, query, where, getDocs, doc, documentId } from "firebase/firestore";
import { db } from '../../firebase/config.js';

// export const getCategories = (parameter) => {
//    return {
//       type: GET_CATEGORIES,
//       payload: parameter
//    }
// }

const addCategoryAndComponentsInItem = async(querySnapshot)=>{
  let items = [];
  console.log('querySnapshot==========', querySnapshot.empty, querySnapshot.docs);
  if(querySnapshot.empty) return [];
  const itemsByCategory = {};
  const categoryIds = [];
  querySnapshot.forEach((doc) => {
    const componentIds = [];
    const components = [];
    console.log('ready to call componennts=======', doc.get('components'));
    doc.get('components') && doc.get('components').forEach(comp=>{
      componentIds.push(comp.id.id);
      components.push({id: comp.id.id, quantity: comp.quantity})
    })
    categoryIds.push(doc.get('categoryId').id);
    if(!itemsByCategory[doc.get('categoryId').id]){
      itemsByCategory[doc.get('categoryId').id] = {items : [{id: doc.id, ...doc.data(), categoryId: doc.get('categoryId').id, componentIds, components}]};
    } else {
      itemsByCategory[doc.get('categoryId').id].push({id: doc.id, ...doc.data(), categoryId: doc.get('categoryId').id, componentIds, components});
    }
  });
  console.log('categoryIds>>>>>>>>>', categoryIds);

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
  console.log('getItemsByCategory===========', categoryId);

  try {
    return async dispatch => {
      const categoryDocRef = doc(db, "categories", categoryId);
      const q = query(collection(db, "items"), where("categoryId", "==", categoryDocRef));

      const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //     items.push({id: doc.id, ...doc.data()});
      //   });
      const items = await addCategoryAndComponentsInItem(querySnapshot);
      console.log('getItemsByCategory items===========', items);
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
      const componentDocRef = doc(db, "components", componentId);
      const q = query(collection(db, "items"), where('componentIds', "array-contains", componentId));

      const querySnapshot = await getDocs(q);
      const items = await addCategoryAndComponentsInItem(querySnapshot);

      // const items = [];
      // querySnapshot.forEach((doc) => {
      //     items.push({id: doc.id, ...doc.data()});
      //   });
        dispatch({
          type: GET_ITEMS_BY_COMPONENT,
          payload: items,
        });
    };
  } catch (error) {
      alert(error);
  }
};
  