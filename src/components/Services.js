import { useContext, useEffect, useState } from "react";
import { RoleContext } from "../App";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addService,
  getServices,
  getServicesRefresh,
} from "./redux-actions/service";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import InventoryIcon from "@mui/icons-material/Inventory";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { ImArrowRight } from "react-icons/im";
import { AiFillDropboxSquare } from "react-icons/ai";
import { CgSearchLoading } from "react-icons/cg";
import { GiAutoRepair } from "react-icons/gi";
import { MdLocalShipping } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Swal from "sweetalert2";

const Services = () => {
  const stripePay = async (cellValues) => {
    if (cellValues.row.price === "to-be-updated") {
      Swal.fire("cannot pay before price update");
    } else {
      axios
        .patch(
          `https://unistore.onrender.com/api/updatepayment/${cellValues.row._id}`,
          { paymentStatus: "paid" },
          { headers: { Authorization: localStorage.getItem("token") } }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      const stripe = await loadStripe(
        "pk_test_51NmBSUSCWcI3CpIv0U8wq7gumq3kFbK1rNxvTK3vWVl2p8bqMW09ad7v0qimTrRRMAaAewOXIuFqGLFqDbZZMcxj00PBAtbn2B"
      );
      let arr = [];
      const obj = {
        name: "Service",
        quantity: 1,
        price: cellValues.row.price,
        token: localStorage.getItem("token"),
      };
      arr.push(obj);
      const body = {
        products: arr,
      };
      console.log(body, "in function");
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      };

      const response = await fetch(
        "https://unistore.onrender.com/api/create-checkout-session",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
          _id: data.tokendata._id,
        }
      );
      const body1 = await response.json();

      if (body1.products) {
        axios
          .patch(
            `https://unistore.onrender.com/api/updateservice/${cellValues.row._id}`,
            { paymentStatus: "paid" },
            { headers: { Authorization: localStorage.getItem("token") } }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      arr = [];

      window.location.href = body1.url;
    }
  };
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "trackingnumber",
      headerName: "Tracking-Id",
      width: 150,
      editable: false,
    },
    {
      field: "model",
      headerName: "Model",
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: "Problem",
      width: 110,
      editable: false,
    },
    {
      field: "courier",
      headerName: "Courier",
      width: 110,
      editable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 190,
      renderCell: (cellValues) => {
        return (
          <div>
            <Tooltip
              title={
                cellValues.row.productRecived === true
                  ? "Product-Recived"
                  : "Not-Recived"
              }
            >
              <span>
                <BsFillBoxSeamFill
                  color={
                    cellValues.row.productRecived === true ? "#2AFF00" : "black"
                  }
                  size="18px"
                />
              </span>
            </Tooltip>{" "}
            <ImArrowRight color="black" />{" "}
            <Tooltip title="Recived">
              <span>
                <AiFillDropboxSquare
                  color={
                    cellValues.row.productRecived === true ? "#2AFF00" : "black"
                  }
                  size="18px"
                />
              </span>
            </Tooltip>{" "}
            <ImArrowRight color="black" />{" "}
            <Tooltip title="Diagnosis">
              <span>
                <CgSearchLoading
                  size="18px"
                  color={
                    cellValues.row.serviceAccepted === true
                      ? "#2AFF00"
                      : "black"
                  }
                />
              </span>
            </Tooltip>{" "}
            <ImArrowRight color="black" />{" "}
            <Tooltip
              title={
                cellValues.row.repaired === true
                  ? "Repair-Completed"
                  : "Repair-Pending"
              }
            >
              <span>
                <GiAutoRepair
                  size="18px"
                  color={cellValues.row.repaired === true ? "#2AFF00" : "black"}
                />
              </span>
            </Tooltip>{" "}
            <ImArrowRight color="black" />{" "}
            <Tooltip title={`Shipping-Id:${cellValues.row.shippingid}`}>
              <span>
                <MdLocalShipping
                  size="18px"
                  color={cellValues.row.shippingid ? "#2AFF00" : "black"}
                />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "payment",
      headerName: "Payment",
      width: 110,
      editable: false,
      renderCell: (cellValues) => {
        return cellValues.row.paymentStatus === "paid" ? (
          <Button
            size="small"
            disabled="true"
            variant="contained"
            color="success"
          >
            Pay
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => {
              stripePay(cellValues);
            }}
            variant="contained"
            color="success"
          >
            Pay
          </Button>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      editable: false,
    },
    {
      field: "paymentStatus",
      headerName: "PaymentStatus",
      width: 110,
      editable: false,
    },
  ];

  const [toggle, setToggle] = useState(false);
  const [formData, setFormdata] = useState({
    trackingnumber: "",
    model: "",
    problem: "",
    courier: "",
  });
  const dispatch = useDispatch();
  const data = useContext(RoleContext);
  const [tokendata, setToken] = useState(localStorage.getItem("token"));
  const [globalData, setGlobalData] = useState(
    localStorage.getItem("globaldata")
      ? JSON.parse(localStorage.getItem("globaldata"))
      : {}
  );

  console.log(data, "data in service");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("globaldata"));

    dispatch(getServicesRefresh(data._id, localStorage.getItem("token")));
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    dispatch(getServices(data));
  }, [toggle]);

  const serviceData = useSelector(
    (state) => {
      console.log(state, "state");
      return state.service.service;
    },
    [toggle]
  );

  console.log(serviceData, "sd");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handelInput = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  const handelSubmit = (e, formData, tokendata, globalData) => {
    e.preventDefault();
    if (
      formData.trackingnumber === "" ||
      formData.courier === "" ||
      formData.model === "" ||
      formData.problem === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Some Fields were found Empty",
      });
    } else {
      axios
        .post("https://unistore.onrender.com/api/createnotification", {
          notification: "Service-Created",
          userid: globalData._id,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      const id = globalData._id;
      console.log(id, "after submit in handel");
      dispatch(addService(tokendata, formData, globalData));
      Swal.fire("Service Job Created");
      dispatch(getServicesRefresh(id, tokendata));
      setToggle(!toggle);
    }
  };

  return (
    <div style={{ margin: "15px", marginLeft: "40%" }}>
      {serviceData.length === 0 ? (
        <Typography sx={{ paddingLeft: "45%" }} variant="h4">
          No Service Record
        </Typography>
      ) : null}

      <Box
        component="form"
        sx={{ width: 300, border: 1, borderColor: "blue", margin: "5px" }}
      >
        <Paper elevation={6} sx={{ backgroundColor: "#E8E8E8" }}>
          <Typography variant="h6">Create Service</Typography>
          <br />
          <TextField
            required
            id="outlined-required"
            label="Tracking-Id"
            name="trackingnumber"
            value={formData.trackingnumber}
            onChange={handelInput}
            size="small"
          />
          <br />
          <br />
          <TextField
            required
            id="outlined-required"
            label="model"
            name="model"
            value={formData.model}
            onChange={handelInput}
            size="small"
          />
          <br />
          <br />
          <TextField
            required
            id="outlined-required"
            label="courier"
            name="courier"
            value={formData.courier}
            onChange={handelInput}
            size="small"
          />
          <br />
          <br />
          <TextField
            required
            name="problem"
            id="outlined-multiline-static"
            label="Problem"
            multiline
            rows={4}
            value={formData.problem}
            onChange={handelInput}
          />
          <br />
          <br />
          <Button
            onClick={(e) => {
              handelSubmit(e, formData, tokendata, globalData);
            }}
            variant="contained"
            color="success"
            size="small"
          >
            Submit
          </Button>
          <br />
          <br />
        </Paper>
      </Box>
      <br />

      <Box sx={{ width: 800, marginLeft: "-240px", border: 1 }}>
        <Paper elevation={6}>
          <DataGrid
            rows={serviceData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            getRowId={(rows) => rows._id}
            getTrackingId={(rows) => rows.trackingnumber}
            disableRowSelectionOnClick
          />
        </Paper>
      </Box>
    </div>
  );
};

export default Services;
