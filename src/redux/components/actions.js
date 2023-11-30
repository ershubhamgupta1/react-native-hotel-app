import { GET_COMPONENTS_BY_IDS } from './actionTypes';
import { collection, query, where, getDocs, doc, documentId } from "firebase/firestore";
import { db } from '../../firebase/config.js';


export const getComponentsByIds = (componentIds) => {
  componentIds = componentIds.map(id=> id.toString());
  try {
    return async dispatch => {
      const q = query(collection(db, "items"), where(documentId(), "in", componentIds));

      const querySnapshot = await getDocs(q);
      const components = [];
      querySnapshot.forEach((doc) => {
        components.push({id: doc.id, ...doc.data()});
      });
      dispatch({
        type: GET_COMPONENTS_BY_IDS,
        payload: components,
      });
    };
  } catch (error) {
      alert(error);
  }
};
  

