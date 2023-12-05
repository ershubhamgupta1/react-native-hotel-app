import { GET_ITEMS, GET_ITEMS_BY_CATEGORY, GET_ITEMS_BY_COMPONENT, GET_EMPTY_ITEMS,
GET_ITEMS_COUNT, GET_ITEM_BY_ID, SEARCH_ITEM_BY_TEXT } from './actionTypes';

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
      case GET_ITEMS_COUNT: 
      return {
         ...state, 
         totalItemsCount: action.payload.count
      }
      case SEARCH_ITEM_BY_TEXT: 
      return {
         ...state, 
         searchedItems: action.payload
      }
      case GET_ITEM_BY_ID: 
      let {items, itemsByCategory, itemsByComponent} = state;
      items = items.map(item=>{
         if(item.id === action.payload.id) return action.payload;
         else return item;
      })
      itemsByComponent = itemsByComponent.map(item=>{
         if(item.id === action.payload.id) return action.payload;
         else return item;
      })
      itemsByCategory = itemsByCategory.map(item=>{
         if(item.id === action.payload.id) return action.payload;
         else return item;
      })

      return {
         ...state,
         items,
         itemsByComponent, 
         itemsByCategory,
         totalItemsCount: action.payload.count
      }
      default: return state
   }
}
export default itemsReducer;