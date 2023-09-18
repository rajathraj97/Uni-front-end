import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, Route, Routes } from "react-router-dom";
import SignIn from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Services from "./Services";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Cart from "./Cart";
import Badge from "@mui/material/Badge";
import { RoleContext } from "../App";
import { useNavigate } from "react-router-dom";
import Manageproducts from "./ManageProducts";
import Success from "./Success";
import Cancel from "./Cancel";
import PrivateRoutes from "./PrivateRoute";
import ProductPage from "./ProductPage";
import MyOrders from "./MyOrders";
import Profile from "./Profile";
import Contact from "./Contact";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PrivateRoute from "./PrivateRoute";
import SpareSeperate from "./SpareSeperate";
import StaffDashboard from "./StaffDashboard";
import Backdrop from "@mui/material/Backdrop";
import { Button, CircularProgress, Paper } from "@mui/material";
import axios from "axios";
const Product = React.lazy(() => import("./Product"));
const Spare = React.lazy(() => import("./Spare"));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [globalData, setGlobalData] = React.useState(
    JSON.parse(localStorage.getItem("globaldata"))
      ? JSON.parse(localStorage.getItem("globaldata"))
      : ""
  );
  const [users, setUsers] = React.useState([]);
  const [notification, setNotification] = React.useState([]);
  const cartData = React.useContext(RoleContext);
  const cart = cartData.cartData;
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/usersforname")
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://unistore.onrender.com/api/getnotification")
      .then((res) => {
        console.log(res);
        setNotification(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handelSeacrch = (e) => {
    if (e.target.id === "search") {
      setSearch(e.target.value);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const viewedNotification = (notification) => {
    notification.map((ele) => {
      return axios.patch(
        `https://unistore.onrender.com/api/updatenotification/${ele._id}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
    });
    axios
      .get("https://unistore.onrender.com/api/getnotification")
      .then((res) => {
        console.log(res);
        setNotification(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogOut = (event) => {
    localStorage.removeItem("token");
    localStorage.removeItem("globaldata");
    navigate("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {localStorage.getItem("token") ? (
        <MenuItem
          style={{ textDecoration: "none", color: "blue" }}
          onClick={handleLogOut}
        >
          LogOut
        </MenuItem>
      ) : (
        <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
          <MenuItem onClick={handleMenuClose}>LogIn</MenuItem>
        </Link>
      )}
      {localStorage.getItem("token") ? (
        <Link to="/profile" style={{ textDecoration: "none", color: "blue" }}>
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        </Link>
      ) : null}
      {localStorage.getItem("token") ? (
        <Link to="/Myorders" style={{ textDecoration: "none", color: "blue" }}>
          <MenuItem onClick={handleMenuClose}>My-Orders</MenuItem>
        </Link>
      ) : null}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    ></Menu>
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              UNI-STORE
            </Typography>
            <form>
              {localStorage.getItem("token") ? (
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search Product"
                    inputProps={{ "aria-label": "search" }}
                    value={search}
                    onChange={(e) => {
                      handelSeacrch(e);
                    }}
                    id="search"
                  />
                </Search>
              ) : null}
            </form>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link
                    to="/cart"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <Badge
                      badgeContent={
                        localStorage.getItem("token") ? cart.length : null
                      }
                      color="success"
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </Link>
                </Typography>
              </IconButton>

              {(cartData.tokendata.role === "admin" ||
                globalData.role === "admin") &&
              localStorage.getItem("token") ? (
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Badge badgeContent={notification.length} color="secondary">
                      <NotificationsIcon onClick={handleOpen} />
                    </Badge>
                    <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      open={open}
                      onClick={handleClose}
                    >
                      <Paper elevation={5}>
                        <Box>
                         {notification.length > 0 ? notification.map((notification) => {
                            return (
                              <div>
                                <Paper elevation={4}>
                                  Event:{notification.notification},By:
                                  {users.map((users) => {
                                    if (notification.userid === users._id) {
                                      return users.username;
                                    }
                                  })}
                                </Paper>
                                <br />
                              </div>
                            );
                          })  : <Typography variant="h5">No new Notifications</Typography>}
                          <br />
                          <Button
                            variant="contained"
                            onClick={() => {
                              viewedNotification(notification);
                            }}
                          >
                            OK
                          </Button>
                        </Box>
                      </Paper>
                    </Backdrop>
                  </Typography>
                </IconButton>
              ) : null}

              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link
                    to="/product"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Products
                  </Link>
                </Typography>
              </IconButton>

              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link
                    to="/spares"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Spares
                  </Link>
                </Typography>
              </IconButton>

              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link
                    to="/services"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Services
                  </Link>
                </Typography>
              </IconButton>

              {(cartData.tokendata.role === "admin" ||
                globalData.role === "admin") &&
              localStorage.getItem("token") ? (
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link
                      to="/dashboard"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Dashboard
                    </Link>
                  </Typography>
                </IconButton>
              ) : null}

              {(globalData.role === "staff" ||
                cartData.tokendata.role === "staff") &&
              localStorage.getItem("token") ? (
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link
                      to="/staffdashboard"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Staff Dashboard
                    </Link>
                  </Typography>
                </IconButton>
              ) : null}

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              ></IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/product"
          element={
            localStorage.getItem("token") ? (
              <React.Suspense fallback={<div>Products Loading....</div>}>
                <Product search={search} />
              </React.Suspense>
            ) : (
              <SignIn />
            )
          }
        />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/spares"
          element={
            localStorage.getItem("token") ? (
              <React.Suspense fallback={<div>Spare Loading....</div>}>
                <Spare />
              </React.Suspense>
            ) : (
              <SignIn />
            )
          }
        />
        <Route
          path="/services"
          element={localStorage.getItem("token") ? <Services /> : <SignIn />}
        />
        <Route
          path="/cart"
          element={localStorage.getItem("token") ? <Cart /> : <SignIn />}
        />
        <Route
          path="/manageproducts"
          element={
            localStorage.getItem("token") ? <Manageproducts /> : <SignIn />
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/spare/:id" element={<SpareSeperate />} />
        <Route path="/Myorders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/staffdashboard" element={<StaffDashboard />} />
        <Route path="/failure" element={<Cancel />} />
      </Routes>
    </div>
  );
}
