import { GET_COMPONENTS_BY_IDS } from './actionTypes';

//initializing state
const initialState = {
   components: [],
}
const componentsReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_COMPONENTS_BY_IDS: 
      return {
         ...state, 
         components: action.payload
      }
      default: return state
   }
}
export default componentsReducer;