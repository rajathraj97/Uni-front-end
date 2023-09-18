import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import axios from 'axios'
import Avatar from '@mui/material/Avatar';
import { MdUpdate } from 'react-icons/md';
import { MdDeleteForever} from 'react-icons/md';
import Swal from 'sweetalert2';









  

  const ProductTable = () =>{

    const[products,setProducts] = React.useState([])

    const updateStock = async(cellValues) =>{
      const { value: stock } = await Swal.fire({
        title: 'Input Stock',
        input: 'number',
        inputLabel: 'Your Stock',
        inputPlaceholder: 'Enter Stock'
      })
      
      if (stock) {
        Swal.fire(`Entered stock: ${stock}`)
        axios.patch(`https://unistore.onrender.com/api/updateproduct/${cellValues.row._id}`,{stock:stock},{headers:{'Authorization':localStorage.getItem('token')}})
        .then((res)=>{
          if(res.data.hasOwnProperty("_id")){
            Swal.fire("updated sucessfully")
            
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      }
    }

    const deleteProduct = async(cellValues) =>{
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:3001/api/deleteproduct/${cellValues.row._id}`,{headers:{'Authorization':localStorage.getItem('token')}})
            .then((res)=>{
              console.log(res.data)
            })
            .catch((err)=>{
              console.log(err)
            })
          Swal.fire(
            'Deleted!',
            'Your Product has been deleted.',
            'success'
          )
        }
      })
    }


    const columns = [
      { field: '_id', headerName: 'ID', width: 90 },
      {
        field: 'image',
        headerName: 'Image',
        type: 'image',
        width: 110,
        editable: false,
        renderCell: (params) =>   <Avatar  src={params.value} />
      },
      {
        field: 'name',
        headerName: 'Product',
        width: 150,
        editable: false,
      },
      {
        field: 'stock',
        headerName: 'Stock',
        type:'number',
        width: 150,
        editable: false,
      },
      
      {
        field: 'Actions',
        headerName: 'Actions',
        renderCell:(cellValues) =>{
          return(<div><Button size="small" onClick={()=>{updateStock(cellValues)}} variant='contained'><MdUpdate size="20px" color='white'/>Update-Stock</Button> <Button onClick={()=>{deleteProduct(cellValues)}} size="small" variant='contained' color="error"><MdDeleteForever  size="20px" color="white"/>Delete-Product</Button></div>)
        },
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 390
      },
    ];


    React.useEffect(()=>{
      axios.get('http://localhost:3001/api/getproduct')
      .then((res)=>{
      setProducts(res.data)
      })
      .catch((err)=>{
        console.log(err)
      })
    },[])
    console.log(products,'product table')
    return(<div>
         <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(rows) => rows._id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        pageSizeOptions={[7]}
        disableRowSelectionOnClick
      />
    </Box>
    </div>)
  }

  export default ProductTable