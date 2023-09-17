import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { RoleContext } from '../../App';
import { useReducer } from 'react';
import Swal from 'sweetalert2';
import { MdDoneOutline } from 'react-icons/md';
import { MdPendingActions } from 'react-icons/md'




 

  const ServiceTable = () =>{
    const[data,setData] = React.useState([])
    const[users,setUser] = React.useState([])
    const globalData = React.useContext(RoleContext)
    console.log(data,'service data')
    console.log(users,'user data in service')

    const reducer = async(state,action)=>{
      switch (action.type){
        case "ACCEPT_SERVICE":{
          console.log(action.value)
          axios.patch(`http://localhost:3001/api/updateservice/${action.value.row._id}`,{serviceAccepted:true,productRecived:true},{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res)
          })
          .catch((err)=>{
            console.log(err)
          })
          axios.get('http://localhost:3001/api/getservices',{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res.data)
            setData(res.data)
          })
          .catch((err)=>{
            console.log(err)
          })
          break;
        }
          case "DECLINE_SERVICE":{
          axios.patch(`http://localhost:3001/api/updateservice/${action.value.row._id}`,{serviceDeclined:true},{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res)
          })
          .catch((err)=>{
            console.log(err)
          })
          axios.get('http://localhost:3001/api/getservices',{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res.data)
            setData(res.data)
          })
          .catch((err)=>{
            console.log(err)
          })
          break
          }

          case "UPDATE_PRICE":{
            const { value: email } = await Swal.fire({
              title: 'Input The Amount',
              input: 'text',
              inputLabel: 'REPAIR AMOUNT',
              inputPlaceholder: 'Enter your repair Amount'
            })
            
            if (email) {
              Swal.fire(`Entered amount: ${email}`)
          axios.patch(`http://localhost:3001/api/updateservice/${action.value.row._id}`,{price:parseInt(email)},{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res)
          })
          .catch((err)=>{
            console.log(err)
          })
          axios.get('http://localhost:3001/api/getservices',{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res.data)
            setData(res.data)
          })
          .catch((err)=>{
            console.log(err)
          })
        }
        break
          }

          case "SERVICE_COMPLETED" :{
            axios.patch(`http://localhost:3001/api/updateservice/${action.value.row._id}`,{diagnose:true,repaired:true},{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res)
          })
          .catch((err)=>{
            console.log(err)
          })
          axios.get('http://localhost:3001/api/getservices',{headers:{'Authorization':localStorage.getItem('token')}})
          .then((res)=>{
            console.log(res.data)
            setData(res.data)
          })
          .catch((err)=>{
            console.log(err)
          })
          break
          }

          case "SHIPPED" : {
            const { value: trackingnumber } = await Swal.fire({
              title: 'Input TrackingNumber',
              input: 'text',
              inputLabel: 'Tracking Number',
              inputPlaceholder: 'Enter Tracking-Number'
            })
            
            if (trackingnumber) {
              Swal.fire(`Entered trackingNumber: ${trackingnumber}`)
              axios.patch(`http://localhost:3001/api/updateservice/${action.value.row._id}`,{shippingid:trackingnumber},{headers:{'Authorization':localStorage.getItem('token')}})
              .then((res)=>{
                console.log(res)
              })
              .catch((err)=>{
                console.log(err)
              })
              axios.get('http://localhost:3001/api/getservices',{headers:{'Authorization':localStorage.getItem('token')}})
              .then((res)=>{
                console.log(res.data)
                setData(res.data)
              })
              .catch((err)=>{
                console.log(err)
              })
            }

            
          }

        
        
        default:{
          return{...state}
        }
      }
    }


    React.useEffect(()=>{
      axios.get('http://localhost:3001/api/getservices',{headers:{'Authorization':localStorage.getItem('token')}})
      .then((res)=>{
        console.log(res.data)
        setData(res.data)
      })
      .catch((err)=>{
        console.log(err)
      })
      axios.get('http://localhost:3001/api/getusers',{headers:{'Authorization':localStorage.getItem('token')}})
      .then((res)=>{
        setUser(res.data)
      })
      .catch((err)=>{
        console.log(err)
      })
    },[])
    

    const columns = [
      { field: '_id', headerName: 'ID', width: 90 },
      {
        field: 'userid',
        headerName: 'User',
        width: 150,
        renderCell :(cellValues) =>{
           return users.map((ele)=>{if(cellValues.row.userid === ele._id){return ele.username} })
        },
        editable: false,
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 150,
        editable: false,
      },
      {
        field: 'trackingnumber',
        headerName: 'Tracking',
        width: 150,
        editable: false,
      },
      {
        field: 'model',
        headerName: 'Model',
        type: 'Model',
        width: 110,
        editable: false,
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment-Status',
        type: 'Model',
        width: 80,
        editable: false,
        renderCell:(cellValues)=>{
          return(cellValues.row.paymentStatus === "pending" ? <Typography variant='body1' color="red">Pending</Typography> : <Typography variant='body1' color="green">Paid</Typography>)
        }
      },
      {
        field: 'Actions',
        headerName: 'Actions',
        renderCell:(cellValues) =>{
          return(cellValues.row.serviceDeclined === true ? <h4>SERVICE REJECTED</h4> :<div>{cellValues.row.serviceAccepted === true ?   <Button variant='contained' disabled="true"  onClick={()=>{dispatch({type:"ACCEPT_SERVICE",value:cellValues})}}>Accepted</Button>   :  <Button variant='contained'  onClick={()=>{dispatch({type:"ACCEPT_SERVICE",value:cellValues})}}>Accept-Service</Button>    } { cellValues.row.serviceAccepted === true ? <Button variant='contained' disabled="true"   color="error">Cannot Decline</Button> : <Button variant='contained' onClick={()=>{ dispatch({type:"DECLINE_SERVICE",value:cellValues})}}  color="error">Decline-Service</Button> } {cellValues.row.price > 0 ? <Button disabled="true" variant='contained'>₹{cellValues.row.price}</Button>  : <Button onClick={()=>{dispatch({type:"UPDATE_PRICE",value:cellValues})}} variant='contained'>Update-Price</Button> } {cellValues.row.repaired === true ? <Button variant='contained' disabled="true"  color="success">Completed</Button>  : <Button variant='contained' onClick={()=>{dispatch({type:"SERVICE_COMPLETED",value:cellValues})}} color="success">Service-Completed</Button>} {cellValues.row.shippingid ? <Button variant='contained' color="success" disabled="true">{cellValues.row.shippingid}</Button> :<Button variant='contained' color="success" onClick={()=>{dispatch({type:"SHIPPED",value:cellValues})}}>Shipped-Sucessfully</Button>} {cellValues.row.shippingid ? <MdDoneOutline size="23px" color='green'/> : <MdPendingActions size="23px" color='#FFBD00'/>}</div>)
        },
        sortable: false,
        width: 1060
      },
    ];

    const[state,dispatch] = useReducer(reducer,data)

    return(<div>
         <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(rows)=>rows._id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
       
        disableRowSelectionOnClick
      />
    </Box>
    </div>)
  }

  export default ServiceTable
