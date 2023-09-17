const initialState = {products:[],spares:[],services:{}}

const initialstate = {
    products:[],
    spares:[],
    brands:[],
    categories:[],
    cartItems:[]
}


const itemsReducer = (state=initialstate,action) =>{
    switch(action.type){
        case "GET_ITEMS":{
            
            return{...state ,products:action.payload.products,spares:action.payload.spares,brands:action.payload.brands,categories:action.payload.categories}
        }
        case "ADD_T0_CART":{
                return{...state,cartItems:[...state.cartItems,action.payload]}
        }
        case "GET_CART":{
            return{...state,cartItems:action.payload}
        }
        case "DELETE_AND_UPDATE":{
            return{...state,cartItems:action.payload}
        }
        default:{
            return{...state}
        }
    }
}
export default itemsReducer