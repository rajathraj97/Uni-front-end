import axios from "axios"

export const getItems = () =>{
return async(dispatch) =>{
try{
    const products = await axios.get('https://unistore.onrender.com/api/getproduct')
    const spares = await axios.get('https://unistore.onrender.com/api/getspares')
    const brands = await axios.get('https://unistore.onrender.com/api/getbrands')
    const categories = await axios.get('https://unistore.onrender.com/api/getcategory')
    dispatch(setData(products.data,spares.data,brands.data,categories.data))
}
catch(e){
        console.log(e)
}
}
}
export const addItems =(id,userData,quantity) =>{
   return async(dispatch)=>{
    try{
        const obj = {productid:id,userid:userData._id,quantity:quantity,address:userData.address,pincode:userData.pincode}
        const addProducts  = await axios.post('https://unistore.onrender.com/api/addproductscart',obj)
        console.log(addProducts.data,'axios data')
        dispatch(addProduct(addProducts.data))

    }
    catch(e){
        console.log(e)
    }
   }
}

export const getCartItems = (id) =>{
    return async(dispatch)=>{
        try{
            
            const cartItems = await axios.get(`https://unistore.onrender.com/api/getcartdetails/${id}`)
            dispatch(getCart(cartItems.data))
        }
        catch(e){
            console.log(e)
        }

    }
}

export const removeItem = (id,data) => {
    return async(dispatch)=>{
        try{
            
            const deleteItemfromCart = await axios.delete(`https://unistore.onrender.com/api/deleteproductscart/${id}`)
            
            const cartItems = await axios.get(`https://unistore.onrender.com/api/getcartdetails/${data.tokendata._id}`)
            
            dispatch(deleteAndUpdate(cartItems.data))
        }
        catch(e){
            console.log(e)
        }
    }
}

export const removeItemPayment = async(cartitem,data)=>{
    return async(dispatch)=>{
        try{
            
            dispatch(afterPayment)
        }
        catch(e){
            console.log(e)
        }
    }
    
}

const afterPayment = (data) =>{

}

const deleteAndUpdate = (data) =>{
    return {type:"DELETE_AND_UPDATE",payload:data}
}


const setData = (products,spares,brands,categories,cartData) =>{
    
    return{type:"GET_ITEMS",payload:{products,spares,brands,categories}}
}

const getCart = (productData) =>{
    return{type:"GET_CART",payload:productData}
}

const addProduct = (products) =>{
    return {type:"ADD_T0_CART",payload:products}
}