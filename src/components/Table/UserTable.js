import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { RoleContext } from "../../App";
import axios from "axios";
import { BiLogoGmail } from "react-icons/bi";
import { FaMobile } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import Swal from "sweetalert2";





const UserTable = () => {


  const email = async(e, cellValues,globaldata) => {
    console.log(cellValues,'cellData')
    const { value: subject } = await Swal.fire({
      title: 'Input suject',
      input: 'text',
      inputLabel: 'subject',
      inputPlaceholder: 'subject'
    })
    
    if (subject) {
      Swal.fire(`Entered email: ${subject}`)
      const { value: body } = await Swal.fire({
        title: 'Input body',
        input: 'text',
        inputLabel: 'body',
        inputPlaceholder: 'body'
      })
      
      if (body) {
        Swal.fire(`Entered email: ${body},${subject}`)
        axios.post("https://unistore.onrender.com/api/sendmail",{email:cellValues.row.email,body:body,subject:subject},{headers:{'Authorization':localStorage.getItem('token')}})
        .then((res)=>{
          if(res.data === "sent"){
            Swal.fire("Sent sucessfully")
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      }
    } 
  }
  
  const mobile = async(e, cellValues,globaldata) => {
    console.log(cellValues,'in mobile');
    console.log(globaldata,'in message')
    const { value: body } = await Swal.fire({
      title: 'Input body',
      input: 'text',
      inputLabel: 'Text',
      inputPlaceholder: 'Enter message'
    })
    
    if (body) {
      Swal.fire(`Entered body: ${body}`)
      axios.post('https://unistore.onrender.com/api/sendmessage',{message:body,number:parseInt(cellValues.row.number)},{headers:{'Authorization':localStorage.getItem('token')}})
      .then((res)=>{
        if(res.data === "success"){
          Swal.fire('Sent sucessfully')
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  };

  const changeRole = async(cellValues) =>{
    const { value: staff } = await Swal.fire({
      title: 'Select field validation',
      input: 'select',
      inputOptions: {
        'Options': {
          user: 'user',
          staff: 'staff',
        },
      },
      inputPlaceholder: 'Select a role',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === 'user' || value === 'staff') {
            resolve()
          } else {
            resolve('You need to select oranges :)')
          }
        })
      }
    })
    
    if (staff) {
      Swal.fire(`You selected: ${staff}`)
      axios.patch(`https://unistore.onrender.com/api/updaterole/${cellValues.row._id}`,{role:staff},{headers:{'Authorization':localStorage.getItem('token')}}) 
      .then((res)=>{
        console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  }
  
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      type: "email",
      width: 150,
      editable: false,
    },
    {
      field: "number",
      headerName: "Mobile",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "role",
      headerName: "Role",
      width: 110,
      editable: false,
    },
    {
      field: "Actions",
      headerName: "Actions",
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              onClick={(event) => {
                email(event, cellValues,globalData);
              }}
              size="small"
              variant="contained"
            >
              <BiLogoGmail size="20px" color="red" />
              Remainder
            </Button>{" "}
            <Button
              size="small"
              onClick={(event) => {
                mobile(event, cellValues,globalData);
              }}
              variant="contained"
            >
              <FaMobile size="20px" color="white" />
              Remainder
            </Button>{" "}
            <Button onClick={()=>{changeRole(cellValues)}} variant="contained" size="small">
              <MdManageAccounts size="20px" color="white" />
            </Button>
          </div>
        );
      },
      sortable: false,
      width: 360,
    },
  ];
  
  const rows = [
    {
      id: 1,
      Product: "A",
      Quantity: 55,
      Stock: 300,
      Actions: <Button>Update-Stock</Button>,
    },
  ];

  const [users, setUsers] = React.useState([]);
  const globalData = React.useContext(RoleContext);

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/api/getusers", {
        headers: { Authorization: globalData.token },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(rows) => rows._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />
      </Box>
    </div>
  );
};

export default UserTable;
