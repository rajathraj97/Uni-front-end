import { useContext } from "react"
import { RoleContext } from "../App"
import Dashboard from "./Dashboard"
import Home from "./Home"
import { Navigate } from "react-router-dom"
import jwtDecode from "jwt-decode"



const PrivateRoute = ({component: component,...rest}) =>{
    const decodedData = jwtDecode(localStorage.getItem('token'))
    return decodedData.role === "admin" ? <Dashboard/> : <Navigate to="/home"/>
    
}

export default PrivateRoute