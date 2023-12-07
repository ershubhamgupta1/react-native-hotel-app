import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import categoriesReducer from './categories/reducer';
import itemsReducer from './items/reducer';

const rootReducer = combineReducers({
    categoriesReducer,
    itemsReducer,
});
export const store = createStore(rootReducer, applyMiddleware(thunk));