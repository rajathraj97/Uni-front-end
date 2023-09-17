import * as React from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { RoleContext } from "../App";
import { addItems, getItems } from "./redux-actions/items";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Spare = () => {
  const [token, setToken] = React.useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [category, setCategory] = React.useState("");
  const [globalData, setGlobalData] = React.useState({});
  const [price, setPrice] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const limit = [1, 2, 3, 4, 5];
  const dispatch = useDispatch();

  const userData = React.useContext(RoleContext);
  const updateToggle = userData.updateToggle;
  const toggle = userData.toggle;

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    dispatch(getItems());
    setGlobalData(JSON.parse(localStorage.getItem("globaldata")));
  }, [localStorage.getItem("token")]);

  let spares = useSelector(
    (state) => {
      return state.item.spares;
    },
    [token]
  );

  const sparesCopy = useSelector(
    (state) => {
      return state.item.spares;
    },
    [token]
  );

  const categories = useSelector(
    (state) => {
      return state.item.categories;
    },
    [token]
  );

  const addProductstoCart = (id, userData, quantity) => {
    dispatch(addItems(id, userData, quantity));
    updateToggle(!toggle);
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleChangePrice = (event) => {
    setPrice(event.target.value);
  };

  const handelSelect = (e) => {
    setQuantity(e.target.value);
  };

  //filter logic
  if (!(category === "")) {
    spares = spares.reduce((pv, cv) => {
      if (cv.category === category) {
        pv.push(cv);
      }
      return pv;
    }, []);
  } else if (category === "") {
    spares = sparesCopy;
  }

  if (price === "low") {
    spares = spares.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (price === "high") {
    spares = spares.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (price === "") {
    spares = sparesCopy;
  }

  return (
    <div style={{ margin: "25px" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <h3>Filters</h3>
        <Grid xs={2}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value={""}>none</MenuItem>
                {categories.map((cat, i) => {
                  return (
                    <MenuItem key={i} value={cat._id}>
                      {cat.category}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid xs={2}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">price</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={price}
                label="Price"
                onChange={handleChangePrice}
              >
                <MenuItem value={"low"}>Low to High</MenuItem>
                <MenuItem value={"high"}>High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <hr />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {spares.map((spare, i) => {
          return (
            <Grid key={i} xs={2.4}>
              <Item>
                <Paper elevation={6}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={spare.image[0]}
                      title={spare.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {spare.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        spare.description
                      </Typography>
                      <hr />
                      <Typography variant="h5" color="black">
                        Price:{spare.price}
                      </Typography>
                    </CardContent>
                    <hr />
                    <Typography variant="body2" color="black">
                      Quantity:{" "}
                      <select onChange={handelSelect}>
                        {limit.map((ele, i) => {
                          return (
                            <option key={i} value={ele}>
                              {ele}
                            </option>
                          );
                        })}
                      </select>
                    </Typography>
                    <CardActions>
                      <Button
                        variant="contained"
                        onClick={() => {
                          addProductstoCart(spare._id, globalData, quantity);
                          handleClick();
                        }}
                        color="warning"
                      >
                        Add to cart
                        <AddShoppingCartIcon />
                      </Button>
                      <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                      >
                        <Alert
                          onClose={handleClose}
                          severity="success"
                          sx={{ width: "100%" }}
                        >
                          Added Spare To cart
                        </Alert>
                      </Snackbar>
                      <Link to={`/spare/${spare._id}`}>
                        <Button variant="contained">View Product</Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Paper>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Spare;
