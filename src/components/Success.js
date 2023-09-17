import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartItems,
  getItems,
  removeItem,
  removeItemPayment,
} from "./redux-actions/items";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Success = () => {
  const [globaldata, setGlobalData] = useState(
    jwt_decode(localStorage.getItem("token"))
  );
  const [cartData, setCartData] = useState([]);
  const [toggle, setToggle] = useState(false);
  console.log(globaldata, "gd");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCartItems(globaldata._id));
    dispatch(getItems());
    setToggle(!toggle);
    axios
      .post("http://localhost:3001/api/createnotification", {
        notification: "Order-Created",
        userid: globaldata._id,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const data = useSelector((state) => {
    return state.item.cartItems;
  });

  const reducedData = data.reduce((pv, cv) => {
    const obj = {
      productid: cv.productid,
      quantity: cv.quantity,
    };
    pv.push(obj);
    return pv;
  }, []);

  useEffect(() => {
    setCartData(reducedData);
  }, [toggle]);

  console.log(cartData, "cart ddd");

  console.log(reducedData, "reduced data");

  useEffect(() => {
    console.log("executed once");
    axios
      .post(
        "http://localhost:3001/api/createorder",
        {
          products: reducedData,
          userid: globaldata._id,
          address: globaldata.address,
          pincode: globaldata.pincode,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        console.log(res, "");
      })
      .catch((err) => {
        console.log(err);
      });
    data.map((ele) => {
      axios.patch(
        `http://localhost:3001/api/updatequantityproduct/${ele.productid}`,
        { quantity: ele.quantity }
      );
    });

    dispatch(getCartItems(globaldata._id));

    setTimeout(() => {
      axios
        .delete(
          `http://localhost:3001/api/deleteafterpayment/${globaldata._id}`
        )
        .then((res) => {
          console.log(res);
        });
      localStorage.removeItem("token");
      localStorage.removeItem("globaldata");
    }, 5000);
  }, [reducedData.length > 0]);

  console.log(data, "data");

  return (
    <div>
      <Box sx={{ marginLeft: "45%", marginTop: "55px" }}>
        <AiFillCheckCircle size="125px" color="green" />
      </Box>
      <Box sx={{ marginLeft: "43%", marginTop: "55px" }}>
        <Typography variant="h2">Success</Typography>
      </Box>
    </div>
  );
};
export default Success;
