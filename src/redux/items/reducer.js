import { GET_ITEMS, GET_ITEMS_BY_CATEGORY, GET_ITEMS_BY_COMPONENT, GET_EMPTY_ITEMS } from './actionTypes';

//initializing state
const initialState = {
   items: [],
   itemsByCategory: [],
   itemsByComponent: [],
   emptyItems: []
}
const itemsReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ITEMS: 
      return {
         ...state, 
         items: action.payload
      }
      case GET_ITEMS_BY_CATEGORY: 
      return {
         ...state, 
         itemsByCategory: action.payload
      }
      case GET_ITEMS_BY_COMPONENT: 
      return {
         ...state, 
         itemsByComponent: action.payload
      }
      case GET_EMPTY_ITEMS: 
      return {
         ...state, 
         emptyItems: action.payload
      }
      default: return state
   }
}
export default itemsReducer;