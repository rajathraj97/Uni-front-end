import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Enquiry = () =>{
    const[data,setData] = React.useState([])

    console.log(data,'enquiry data')

    React.useEffect(()=>{
        axios.get('https://unistore.onrender.com/api/getenquiry',{headers:{'Authorization':localStorage.getItem('token')}})
        .then((res)=>{
            setData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    const columns = [
        { field: '_id', headerName: 'ID', width: 90 },
        {
          field: 'name',
          headerName: 'First name',
          width: 150,
          editable: true,
        },
        
        {
          field: 'email',
          headerName: 'EMAIL',
          width: 110,
          editable: true,
        },
        {
          field: 'number',
          headerName: 'Number',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
        },
        {
            field: 'description',
            headerName: 'Description',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
          }
      ];
    return(<div>
        <DataGrid
        rows={data}
        getRowId={(rows) =>rows._id }
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </div>)
}

export default Enquiry