import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import PaidIcon from "@mui/icons-material/Paid";
import PeopleIcon from "@mui/icons-material/People";
import HandymanIcon from "@mui/icons-material/Handyman";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Switch from "@mui/material/Switch";
import { Button, Stack, Typography } from "@mui/material";
import SpareTable from "./Table/SpareTable";
import ProductTable from "./Table/ProductsTable";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Example from "./Charts/StockShortage";
import UserTable from "./Table/UserTable";
import OrderTable from "./Table/OrderTable";
import ServiceTable from "./Table/ServiceRequest";
import { Link } from "react-router-dom";
import axios from "axios";
import { RoleContext } from "../App";
import Enquiry from "./Table/Enquiry";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

//SWITCH
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? `rgba(255,255,255,.35)`
        : "rgba(0,0,0,.25)",

    boxSizing: "border-box",
  },
}));

const Dashboard = () => {
  const [table, setTable] = React.useState(true);
  const [data, setData] = React.useState({
    service: [],
    users: [],
  });
  const [products, setProducts] = React.useState([]);
  const [toggle, setToggle] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState([]);
  const [shipped, setShipped] = React.useState(0);
  const [price, settotalPrice] = React.useState(0);
  const [toggle1, setToggle1] = React.useState(false);

  const globalData = React.useContext(RoleContext);

  const handelClick = () => {
    setTable(!table);
  };

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getusers", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setData({ ...data, users: res.data });
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
  }, [toggle]);

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getservices", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setData({ ...data, service: res.data });
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getdata", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setTotalItems(res.data);
        setToggle1(!toggle1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  setTimeout(() => {
    const temporaryArr = totalItems.reduce((pv, cv) => {
      const obj = {
        productid: cv.products.map((ele) => {
          return ele.productid;
        }),
        userid: cv.userid,
        quantity: cv.products.map((ele) => {
          return ele.quantity;
        }),
        amount: cv.products.map((ele) => {
          return products.filter((product) => {
            if (ele.productid === product._id) {
              return product.price;
            }
          });
        }),
      };
      pv.push(obj);
      return pv;
    }, []);

    const totalPrice = temporaryArr.reduce((pv, cv) => {
      console.log(cv, "for total price");
      cv.amount.map((ele, i) => {
        return ele.map((amount) => {
          pv += cv.quantity[i] * amount.price;
          return pv;
        });
      });

      return pv;
    }, 500);

    settotalPrice(totalPrice);

    const shipped = totalItems.reduce((pv, cv) => {
      if (cv.shipped === true) {
        pv += 1;
      }
      return pv;
    }, 0);
    setShipped(shipped);
  }, 2000);

  return (
    <div style={{ margin: "10px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid xs>
            <Paper elevation={6}>
              <Item sx={{ backgroundColor: "#E2F6CA" }}>
                <PaidIcon fontSize="large" style={{ color: "#818EEC" }} />
                <Typography variant="h4">TOTAL-SALES:</Typography>
                <Typography color="black" variant="h4">
                  ₹{price}
                </Typography>
                <br />
                <br />
              </Item>
            </Paper>
          </Grid>
          <Grid xs>
            <Paper elevation={6}>
              <Item sx={{ backgroundColor: "#FDE5EC" }}>
                <PeopleIcon fontSize="large" style={{ color: "#916DB3" }} />
                <Typography variant="h4">TOTAL-USERS:</Typography>
                <Typography color="black" variant="h4">
                  {data.users.length}
                </Typography>
                <Box
                  sx={{
                    color: "blue",
                    display: "inline",
                    fontWeight: "bold",
                    mx: 0.5,
                    fontSize: 14,
                  }}
                >
                  {data.users.length}
                </Box>
                <Box
                  sx={{
                    color: "text.secondary",
                    display: "inline",
                    fontSize: 14,
                  }}
                >
                  new Users
                </Box>
                <br />
                <br />
              </Item>
            </Paper>
          </Grid>
          <Grid xs>
            <Paper elevation={6}>
              <Item sx={{ backgroundColor: "#C8FFE0" }}>
                <HandymanIcon fontSize="large" style={{ color: "#614BC3" }} />
                <Typography variant="h4">SERVICE-REQUESTS:</Typography>
                <Typography color="black" variant="h4">
                  {data.service.length}
                </Typography>
                <Box
                  sx={{
                    color: "blue",
                    display: "inline",
                    fontWeight: "bold",
                    mx: 0.5,
                    fontSize: 14,
                  }}
                >
                  {data.service.length}
                </Box>
                <Box
                  sx={{
                    color: "text.secondary",
                    display: "inline",
                    fontSize: 14,
                  }}
                >
                  new requests
                </Box>
                <br />
                <br />
              </Item>
            </Paper>
          </Grid>
          <Grid xs>
            <Paper elevation={6}>
              <Item sx={{ backgroundColor: "#33BBC5" }}>
                <LocalShippingIcon
                  fontSize="large"
                  style={{ color: "#614BC3" }}
                />
                <Typography variant="h4">ORDERS-SHIPPED:</Typography>
                <Typography color="black" variant="h4">
                  {shipped}
                </Typography>
                <br />
                <br />
              </Item>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid xs={8}>
            <Paper elevation={6}>
              <Item>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>PRODUCTS</Typography>
                  <AntSwitch
                    defaultChecked
                    inputProps={{ "aria-label": "ant design" }}
                    onClick={handelClick}
                  />
                  <Typography>SPARES</Typography>
                  <Link to="/manageproducts">
                    <Button size="small" variant="contained">
                      Manage Products
                    </Button>
                  </Link>
                </Stack>
                {table === true ? <SpareTable /> : <ProductTable />}
              </Item>
            </Paper>
          </Grid>
          <Grid xs={4}>
            <Paper elevation={6}>
              <Item>
                <Typography variant="h5">
                  Re-Stock
                  <WhatshotIcon fontSize="large" style={{ color: "#EA831C" }} />
                </Typography>
                <Example />
              </Item>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          <Grid xs>
            <Paper elevation={6}>
              <Item>
                <Typography variant="h5">USERS</Typography>
                <UserTable />
              </Item>
            </Paper>
          </Grid>
          <Grid xs>
            <Paper elevation={6}>
              <Item>
                <Typography variant="h5">NEW-ORDERS</Typography>
                <OrderTable />
              </Item>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          <Grid xs>
            <Paper elevation={6}>
              <Item>
                <Typography variant="h5">SERVICE-REQUEST</Typography>
                <ServiceTable />
              </Item>
            </Paper>
          </Grid>
          <Grid xs>
            <Paper elevation={6}>
              <Item>
                <Typography variant="h5">ENQUIRY-DETAILS</Typography>
                <Enquiry />
              </Item>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
