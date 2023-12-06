import { GET_CATEGORIES, GET_CATEGORIES_LOADING } from './actionTypes';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config.js';

// export const getCategories = (parameter) => {
//    return {
//       type: GET_CATEGORIES,
//       payload: parameter
//    }
// }

export const getCategories = () => {
    try {
      return async dispatch => {
        dispatch({
          type: GET_CATEGORIES_LOADING,
          payload: {isLoading: true},
        });
        const q = query(collection(db, "categories"));
        const querySnapshot = await getDocs(q);
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({id: doc.id, ...doc.data()});
        });
        categories.sort((a, b)=> a.displayOrder - b.displayOrder);
        dispatch({
          type: GET_CATEGORIES,
          payload: categories,
        });
      };
    } catch (error) {
        console.log('got error in fetching categories------', error);
        alert(error);
    }
  };
  