import { GET_ITEMS, GET_ITEMS_BY_CATEGORY, GET_ITEMS_BY_COMPONENT, GET_EMPTY_ITEMS,
GET_ITEMS_COUNT, GET_ITEM_BY_ID, SEARCH_ITEM_BY_TEXT, GET_ITEMS_BY_CATEGORY_LOADING, GET_ITEMS_LOADING } from './actionTypes';

//initializing state
const initialState = {
   items: [],
   itemsByCategory: [],
   itemsByComponent: [],
   emptyItems: [],
   isLoading: false
}
const itemsReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ITEMS: 
      return {
         ...state, 
         items: action.payload,
         isLoading: false
      }
      case GET_ITEMS_LOADING: 
      return {
         ...state, 
         isLoading: true,
      }
      case GET_ITEMS_BY_CATEGORY_LOADING: 
      return {
         ...state, 
         isLoading: true,
         itemsByCategory: action.payload
      }
      case GET_ITEMS_BY_CATEGORY: 
      return {
         ...state, 
         isLoading: false,
         itemsByCategory: action.payload
      }
      case GET_ITEMS_BY_COMPONENT: 
      return {
         ...state, 
         itemsByComponent: action.payload,
         isLoading: false
      }
      case GET_EMPTY_ITEMS: 
      return {
         ...state, 
         emptyItems: action.payload,
         isLoading: false
      }
      case GET_ITEMS_COUNT: 
      return {
         ...state, 
         totalItemsCount: action.payload.count,
         isLoading: false
      }
      case SEARCH_ITEM_BY_TEXT: 
      return {
         ...state, 
         searchedItems: action.payload,
         isLoading: false
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
      });
      const itemIndexByComp = itemsByComponent.findIndex(item=> item.id === action.payload.id);
      if(itemIndexByComp === -1) itemsByComponent.push(action.payload);

      const itemIndexByCat = itemsByCategory.findIndex(item=> item.id === action.payload.id);
      if(itemIndexByCat === -1) itemsByCategory.push(action.payload);

      const itemIndex = items.findIndex(item=> item.id === action.payload.id);
      if(itemIndex === -1) items.push(action.payload);

      return {
         ...state,
         items,
         itemsByComponent, 
         itemsByCategory,
         totalItemsCount: action.payload.count,
         isLoading: false
      }
      default: return state
   }
}
export default itemsReducer;