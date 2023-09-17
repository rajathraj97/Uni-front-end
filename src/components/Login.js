import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getItems } from "./redux-actions/items";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { RoleContext } from "../App";
import jwt_decode from "jwt-decode";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Uni-Store
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [login, setLogin] = React.useState({
    email: "",
    password: "",
    otp: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Data = React.useContext(RoleContext);
  const updateTokenData = Data.updateTokenData;
  const updateToken = Data.updateToken;
  const imageURL = "https://www.adorama.com/images/cms/40053261_2_39529.jpg";

  const handelChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    if (e.target.id === "otp") {
      setLogin({ ...login, otp: e.target.value });
    }
  };

  const getOtp = async (e) => {
    e.preventDefault();
    let res = await axios.post("http://localhost:3001/api/login", login);
  };

  const generateToken = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:3001/api/loginverification",
      login
    );
    console.log(res.data);
    if (res.status === 200) {
      navigate("/");
      localStorage.setItem("token", res.data);

      dispatch(getItems());
      const decode = jwt_decode(localStorage.getItem("token"));

      updateTokenData(decode);
      updateToken(localStorage.getItem("token"));
    } else if (res.status === 203) {
      Swal.fire("incorrect otp or password");
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imageURL})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <Typography align="center" sx={{ color: "white" }} variant="h6">
          LOGIN TO CONTINUE
        </Typography>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box sx={{ mt: 1 }}>
                <form onSubmit={getOtp}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={login.email}
                    onChange={handelChange}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={login.password}
                    onChange={handelChange}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    sx={{ color: "white" }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Get OTP
                  </Button>
                </form>

                <form onSubmit={generateToken}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={login.otp}
                    onChange={handelChange}
                    id="otp"
                    label="otp"
                    name="otp"
                    autoFocus
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Log-In
                  </Button>
                </form>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link
                      to="/signup"
                      style={{ textDecoration: false, color: "blue" }}
                    >
                      {" "}
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      </div>
    </Box>
  );
}
