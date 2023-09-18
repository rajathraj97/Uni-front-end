import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { useDispatch, useSelector } from "react-redux";
import { RoleContext } from "../App";
import { Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { getCartItems, getItems } from "./redux-actions/items";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import InputNumber from "rc-input-number";
import { removeItem } from "./redux-actions/items";
import { loadStripe } from "@stripe/stripe-js";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const Cart = () => {
  const [toggle, setToggle] = React.useState(false);
  const [updateAddress, setAddress] = React.useState({
    address: "",
    pincode: "",
  });
  const dispatch = useDispatch();
  const data = React.useContext(RoleContext);
  const userData = data.tokendata;
  const cartItems = data.cartData;

  const itemFilter = useSelector((state) => {
    return state;
  }, []);

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem("globaldata"));
    dispatch(getCartItems(data._id));
  }, [toggle]);

  const mixedItems = [...itemFilter.item.products, ...itemFilter.item.spares];

  const filteredItems = mixedItems.reduce((pv, cv) => {
    cartItems.map((cart) => {
      if (cart.productid === cv._id) {
        cv["quantity"] = cart.quantity;
        pv.push(cv);
      }
      return pv;
    });
    return pv;
  }, []);

  //Total calculation
  const totalPrice = filteredItems.reduce((pv, cv) => {
    pv += cv.price * cv.quantity;

    return pv;
  }, 0);

  const handelClick = () => {
    setToggle(!toggle);
  };

  const handelAddress = (e) => {
    if (e.target.name === "pincode") {
      setAddress({ ...updateAddress, pincode: parseInt(e.target.value) });
    } else {
      setAddress({ ...updateAddress, address: e.target.value });
    }
  };

  const handelAddressSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(
        `https://unistore.onrender.com/api/updateproductscart/${userData._id}`,
        updateAddress
      )
      .then((res) => {
        if (res.data.acknowledged === true) {
          Swal.fire("address updated sucessfully");
          setToggle(false);
        } else {
          Swal.fire("error occured");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handelCancel = () => {
    setAddress({ address: "", pincode: "" });
    setToggle(false);
  };

  const removeItemCart = (id, data, cartItems) => {
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
        const result = cartItems.filter((ele) => {
          return ele.productid === id;
        });
        console.log(result, "result");
        result.map((ele) => {
          dispatch(removeItem(ele._id, data));
        });
        setToggle(!toggle);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const showStripe = async () => {
    const stripe = await loadStripe(
      "pk_test_51NmBSUSCWcI3CpIv0U8wq7gumq3kFbK1rNxvTK3vWVl2p8bqMW09ad7v0qimTrRRMAaAewOXIuFqGLFqDbZZMcxj00PBAtbn2B"
    );
    const body = {
      products: filteredItems,
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
    window.location.href = body1.url;
  };

  return (
    <div style={{ margin: "25px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <Paper elevation={9}>
              <Item sx={{ backgroundColor: "#B2B1AF" }}>
                <Typography variant="body1">
                  Name:{userData.username}
                </Typography>
                <hr />
                <br />
                <Typography variant="body1">Email:{userData.email}</Typography>
                <hr />
                <br />
                <Typography variant="body1">
                  Mobile:{userData.number}
                </Typography>
                <hr />
                <br />
                <Typography variant="body1">
                  Address:{userData.address}
                </Typography>
                <hr />
                <br />
                <Typography variant="body1">
                  Pincode:{userData.pincode}
                </Typography>
                <hr />
                <br />
                <Button size="small" variant="contained" onClick={handelClick}>
                  Change Address
                </Button>
                <br />
                <br />
                {toggle === true ? (
                  <div>
                    <TextField
                      size="small"
                      required
                      name="address"
                      id="outlined-required"
                      label="Address"
                      value={updateAddress.address}
                      onChange={handelAddress}
                      defaultValue="Hello World"
                    />
                    <br />
                    <br />
                    <TextField
                      size="small"
                      required
                      name="pincode"
                      id="outlined-required"
                      label="Pincode"
                      value={updateAddress.pincode}
                      onChange={handelAddress}
                    />
                    <br />
                    <br />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handelAddressSubmit}
                    >
                      Submit
                    </Button>{" "}
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={handelCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : null}
                {!(updateAddress.address === "") ? (
                  <div>
                    <h5>New Shipping Address</h5>
                    <br />
                    <Typography variant="body1">
                      Address:{updateAddress.address}
                    </Typography>
                    <hr />
                    <br />
                    <Typography variant="body1">
                      Pincode:{updateAddress.pincode}
                    </Typography>
                    <br />
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={handelCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : null}
              </Item>
            </Paper>
          </Grid>
          <Grid xs={8.9}>
            <Paper elevation={9}>
              <Item>
                <Stack spacing={2}>
                  {filteredItems.map((ele, i) => {
                    return (
                      <Item key={i}>
                        <Typography
                          variant="body"
                          sx={{ paddingLeft: "1020px" }}
                        >
                          Quantity:{ele.quantity}, Price:{ele.price}/unit
                        </Typography>
                        <Grid container spacing={0}>
                          <Grid xs={2.5}>
                            <Card sx={{ maxWidth: 345 }}>
                              <CardMedia
                                component="img"
                                alt="green iguana"
                                height="140"
                                image={ele.image[0]}
                              />
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {ele.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  product description
                                </Typography>
                                <hr />
                                <Typography
                                  variant="subtitle2"
                                  color="black"
                                  gutterBottom
                                >
                                  Price:{ele.price}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={(e) => {
                                    removeItemCart(ele._id, data, cartItems);
                                  }}
                                  color="error"
                                >
                                  Remove Item
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        </Grid>
                      </Item>
                    );
                  })}
                </Stack>
              </Item>
            </Paper>
            <br />
            <Paper elevation={8}>
              <Box>
                {totalPrice === 0 ? (
                  <h4>No Items in Cart</h4>
                ) : (
                  <Typography sx={{ paddingLeft: "1080px" }} variant="h3">
                    Total:{totalPrice}{" "}
                  </Typography>
                )}

                <Box sx={{ paddingLeft: "1080px", paddingBottom: "15px" }}>
                  {totalPrice > 0 ? (
                    <Button
                      onClick={showStripe}
                      variant="contained"
                      color="success"
                    >
                      Proceed to Pay: {totalPrice}
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Cart;
