import './App.css';
import Navbar from './components/Navbar';
import { useState,createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems } from './components/redux-actions/items';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import $ from 'jquery';
import Popper from 'popper.js';

export const RoleContext = createContext() 

function App() {
 const[token,setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")
 const[login,setLogin] = useState("false")
 const[tokendata,setTokendata] = useState({})
 
 const[toggle,setToggle] = useState(false)
 
 


 const dispatch = useDispatch()
 

 useEffect(()=>{
    dispatch(getCartItems(tokendata._id))
    setToggle(!toggle)
 },[tokendata])

 const cartData = useSelector((state)=>{
  return state.item.cartItems
  },[toggle])

 const updateToggle = (value) =>{
  setToggle(value)
 }

 const updateLogin = (value) =>{
  setLogin(value)
 }
 
 const updateTokenData = (value) =>{
  setTokendata(value)
  localStorage.setItem('globaldata',JSON.stringify(value))
 }

 const updateToken = (token) =>{
  setToken(token)
 }
 
  return (
    <div >
      <RoleContext.Provider value={{tokendata,token,cartData,updateToggle,toggle,updateTokenData,updateToken}}>
      <Navbar/>
      </RoleContext.Provider>
    </div>
  );
}

export default App;
