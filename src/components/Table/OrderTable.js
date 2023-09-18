import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Tooltip } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const OrderTable = () => {
  const [orderdata, setData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getdata", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://unistore.onrender.com/api/getproduct")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://unistore.onrender.com/api/getusers", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(users, "orderdata1");
  console.log(products, "orderdata");
  console.log(orderdata, "orderdata");

  const handelShipment = async (cellValues) => {
    console.log(cellValues, "shipment handel");
    console.log(localStorage.getItem("token"), "token");
    const { value: track } = await Swal.fire({
      title: "Input Tracking Number",
      input: "text",
      inputLabel: "Tracking Number",
      inputPlaceholder: "Enter Trackin Number",
    });

    if (track) {
      Swal.fire(`Entered Tracking Number: ${track}`);
      axios
        .patch(
          `http://localhost:3001/api/updateorder/${cellValues.row._id}`,
          { shipped: true, trackingid: track },
          { headers: { Authorization: localStorage.getItem("token") } }
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.shipped === true) {
            Swal.fire("updated sucessfully");
            axios
              .get("http://localhost:3001/api/getdata", {
                headers: { Authorization: localStorage.getItem("token") },
              })
              .then((res) => {
                setData(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  console.log(orderdata, "products data in dashboard");
  const columns = [
    { field: "_id", headerName: "ID", width: 110 },
    {
      field: "productid",
      headerName: "Product",
      width: 210,
      editable: false,
      renderCell: (cellValues) => {
        return cellValues.row.products.map((ele) => {
          return products.map((product) => {
            if (ele.productid === product._id) {
              return (
                <Tooltip
                  title={`Product:${product.name},Quantity:${ele.quantity}`}
                >
                  {product.name + "," + " "}
                </Tooltip>
              );
            }
          });
        });
      },
    },
    {
      field: "userid",
      headerName: "UserName",
      width: 95,
      editable: false,
      renderCell: (cellValues) => {
        return users.map((ele) => {
          if (cellValues.row.userid === ele._id) {
            return ele.username;
          }
        });
      },
    },
    {
      field: "address",
      headerName: "Address",
      width: 110,
      editable: false,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      width: 110,
      editable: false,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 70,
      editable: false,
      renderCell: (cellValues) => {
        return cellValues.row.products.map((ele) => {
          return ele.quantity + ",";
        });
      },
    },
    {
      field: "shipped",
      headerName: "Actions",
      renderCell: (cellValues) => {
        return cellValues.row.shipped === true ? (
          <h3>Shipped</h3>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              handelShipment(cellValues);
            }}
          >
            Shipped
          </Button>
        );
      },
      sortable: false,
      width: 160,
    },
    {
      field: "trackingid",
      headerName: "Shipment-Status",
      width: 70,
      editable: false,
    },
  ];

  return (
    <div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={(rows) => rows._id}
          rows={orderdata}
          columns={columns}
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

export default OrderTable;
