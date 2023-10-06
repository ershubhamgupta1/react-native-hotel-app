import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import categoriesReducer from './categories/reducer';
import itemsReducer from './items/reducer';
import componentsReducer from './components/reducer';

const rootReducer = combineReducers({
    categoriesReducer,
    itemsReducer,
    componentsReducer
});
export const store = createStore(rootReducer, applyMiddleware(thunk));