import { GET_CATEGORIES, GET_CATEGORIES_LOADING } from './actionTypes';

//initializing state
const initialState = {
   categories: [],
   isLoading: false
}
const categoriesReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_CATEGORIES: 
      return {
         ...state, 
         categories: action.payload,
         isLoading: false
      }
      case GET_CATEGORIES_LOADING: 
      return {
         ...state,
         isLoading: true
      }
      
      default: return state
   }
}
export default categoriesReducer;