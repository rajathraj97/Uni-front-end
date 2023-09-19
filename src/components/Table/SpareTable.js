import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const SpareTable = () => {
  const [spares, setSpares] = React.useState([]);
  const [avg,setAvg] = React.useState(0)

  const updateStock = async (cellValues) => {
    const { value: stock } = await Swal.fire({
      title: "Input Stock",
      input: "number",
      inputLabel: "Update Stock",
      inputPlaceholder: "Enter new Stock",
    });

    if (stock) {
      Swal.fire(`Entered stock: ${stock}`);
      axios
        .patch(
          `https://unistore.onrender.com/api/updatespare/${cellValues.row._id}`,
          { stock: stock },
          { headers: { Authorization: localStorage.getItem("token") } }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const deleteSpare = async (cellValues) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://unistore.onrender.com/api/deletespare/${cellValues.row._id}`,
            { headers: { Authorization: localStorage.getItem("token") } }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        Swal.fire("Deleted!", "Your Product has been deleted.", "success");
      }
    });
  };
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "image",
      headerName: "Image",
      type: "image",
      renderCell: (params) => <Avatar src={params.value} />,
      width: 150,
      editable: false,
    },
    {
      field: "name",
      headerName: "Product",
      width: 150,
      editable: false,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
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
              onClick={() => {
                updateStock(cellValues);
              }}
              size="small"
              variant="contained"
            >
              Update-Stock
            </Button>{" "}
            <Button
              onClick={() => {
                deleteSpare(cellValues);
              }}
              size="small"
              color="error"
              variant="contained"
            >
              Delete-Item
            </Button>
          </div>
        );
      },
      sortable: false,
      width: 260,
    },
  ];
  console.log(spares, "spares table");
  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getspares")
      .then((res) => {
        setSpares(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get("http://unistore.onrender.com/api/getdetails")
    .then((res)=>{
      setAvg(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }, []);
  return (
    <div>
      <Box sx={{ height: 400, width: "100%" }}>
        average spare stock:{avg}
        <DataGrid
          rows={spares}
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
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default SpareTable;
