import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link, redirect, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Swal from "sweetalert2";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
        UniStore
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Register() {
  const navigate = useNavigate();

  const reducer = (state, action) => {
    switch (action.type) {
      case "USER_INFO":
        if (action.field === "mobilenumber") {
          return { ...state, number: parseInt(action.value) };
        } else if (action.field === "pincode") {
          return { ...state, pincode: parseInt(action.value) };
        } else {
          return { ...state, [action.field]: action.value };
        }

      case "ADD_USER_TO_DB":
        axios
          .post("http://localhost:3001/api/register", state)
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              Swal.fire("Registerd Sucessfully proceed to Login Page");
              navigate("/login");
            }
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "All data not filled for registration!",
            });
          });

      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    username: "",
    email: "",
    address: "",
    number: null,
    password: "",
    pincode: null,
  });
  const [emailTrigger, setEmailTrigger] = React.useState(false);
  const imageURL =
    "https://cdn.hasselblad.com/f/77891/2500x1406/4167631565/mavic-3-classic-kv.jpg";
  console.log(state);

  React.useEffect(() => {
    if (state.email.includes("@")) {
      axios
        .post("http://localhost:3001/api/findemail", { email: state.email })
        .then((res) => {
          console.log(res);
          if (res.data.hasOwnProperty("_id")) {
            setEmailTrigger(true);
          } else if (res.data.hasOwnProperty("email")) {
            setEmailTrigger(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state.email]);

  const handelChange = (field) => (e) => {
    dispatch({ type: "USER_INFO", field, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_USER_TO_DB" });
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
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    value={state.username}
                    onChange={handelChange("username")}
                    id="username"
                    label="username"
                    autoFocus
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={6}>
                  {emailTrigger === false ? (
                    <TextField
                      required
                      fullWidth
                      value={state.email}
                      onChange={handelChange("email")}
                      id="email"
                      label="email"
                      name="email"
                      autoComplete="email"
                    />
                  ) : (
                    <TextField
                      error
                      id="filled-error"
                      label="Email-exists"
                      value={state.email}
                      onChange={handelChange("email")}
                      variant="filled"
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={state.password}
                    onChange={handelChange("password")}
                    type="password"
                    id="password"
                    label="password"
                    name="password"
                    autoComplete="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={state.number}
                    onChange={handelChange("mobilenumber")}
                    name="mobilenumber"
                    label="mobile with countrycode"
                    type="mobilenumber"
                    id="mobilenumber"
                    inputProps={{ maxLength: 12 }}
                    autoComplete="mobilenumber"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={state.address}
                    onChange={handelChange("address")}
                    name="address"
                    label="address"
                    type="address"
                    id="address"
                    autoComplete="address"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={state.pincode}
                    onChange={handelChange("pincode")}
                    name="pincode"
                    label="pincode"
                    type="pincode"
                    id="pincode"
                    inputProps={{ maxLength: 6 }}
                    autoComplete="pincode"
                  />
                </Grid>
                <Grid item xs={12}></Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    to="/login"
                    style={{ color: "blue", textDecoration: "none" }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </Box>
  );
}
