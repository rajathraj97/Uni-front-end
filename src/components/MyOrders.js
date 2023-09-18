import axios from "axios";
import * as React from "react";
import { RoleContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { getItems } from "./redux-actions/items";

const MyOrders = () => {
  const [myOrders, setMyOrders] = React.useState([]);
  const [globaldataa, setGlobalDataa] = React.useState({});
  const [rowData, setRowData] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const globalData = React.useContext(RoleContext);
  const dispatch = useDispatch();

  const products = useSelector((state) => {
    return state.item.products;
  });

  React.useEffect(() => {
    setGlobalDataa(globalData);
    dispatch(getItems());
  }, []);

  React.useEffect(() => {
    console.log(globalData, "globaldata");
    axios
      .get(
        `https://unistore.onrender.com/api/getonedata/${
          JSON.parse(localStorage.getItem("globaldata"))._id
        }`,
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        console.log(res);
        setMyOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setRowData(reducedData);
  }, [globaldataa]);

  const reducedData = myOrders.reduce((pv, cv) => {
    cv.products.map((ele) => {
      Object.assign(
        ele,
        { rating: 0 },
        { reviewed: false },
        { originalid: cv._id },
        { reviewed: cv.reviewed }
      );
      pv.push(ele);
      return pv;
    });
    return pv;
  }, []);

  const addRating = (e) => {
    setRating(e.target.value);
  };
  const handelClick = (CellValue, globalData, rating) => {
    axios
      .post(
        "https://unistore.onrender.com/api/createreview",
        {
          productid: CellValue.row.productid,
          userid: globalData.tokendata._id,
          rating: rating,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        console.log(res);
        if (res.hasOwnProperty("_id")) {
          setRating(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .patch(
        `https://unistore.onrender.com/api/updateorder/${CellValue.row.originalid}`,
        { reviewed: true },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "product",
      headerName: "Product-Name",
      width: 150,
      editable: false,
      renderCell: (CellValue) => {
        return products.map((ele) => {
          if (CellValue.row.productid === ele._id) {
            return ele.name;
          }
        });
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      editable: false,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 310,
      editable: false,
      renderCell: (CellValue) => {
        console.log(CellValue);
        return CellValue.row.reviewed === true ? (
          <h5>Review-Sumitted</h5>
        ) : (
          <div>
            <Rating
              name="no-value"
              defaultvalue={1}
              onChange={(e) => {
                addRating(e);
              }}
            />{" "}
            <Button
              onClick={() => {
                handelClick(CellValue, globalData, rating);
              }}
              size="small"
              variant="contained"
              color="success"
            >
              Submit
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ alignSelf: "center" }}>My Orders</h1>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={reducedData}
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

export default MyOrders;
