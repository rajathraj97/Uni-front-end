import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from "redux-thunk"
import itemsReducer from '../reducer/itemsReducer'
import serviceReducer from '../reducer/serviceReducer'


const configureStore = () =>{
    const store = createStore(combineReducers({
        item:itemsReducer,
        service:serviceReducer
    }),applyMiddleware(thunk))
    return store
}

export default configureStore