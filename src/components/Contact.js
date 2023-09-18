import { Box, Button, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
const Contact = () => {
  const [enquiry, setEnquiry] = useState({
    name: "",
    email: "",
    description: "",
    number: 0,
  });

  const Submit = (enquiry) => {
    axios
      .post("https://unistore.onrender.com/api/createenquiry", enquiry)
      .then((res) => {
        if (res.data.hasOwnProperty("_id")) {
          setEnquiry({ name: "", email: "", description: "", number: 0 });
          Swal.fire("posted sucessfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ margin: "20px" }}>
      <Paper sx={{ marginLeft: "45%", width: 1 / 4 }} elevation={9}>
        <Box sx={{ margin: "10px" }}>
          <Typography align="center" variant="h5">
            ENQUIRY
          </Typography>
          <hr />
          <label>Name: </label>
          <TextField
            required
            id="outlined-required"
            label="Name"
            placeholder="Name"
            size="small"
            align="center"
            value={enquiry.name}
            name="name"
            type="text"
            onChange={handelChange}
          />
          <br />
          <br />
          <label>Email: </label>
          <TextField
            required
            id="outlined-required"
            label="Email"
            placeholder="Email"
            size="small"
            value={enquiry.email}
            name="email"
            type="email"
            onChange={handelChange}
          />
          <br />
          <br />
          <label>Description: </label>
          <TextField
            id="outlined-multiline-flexible"
            label="Description"
            multiline
            maxRows={4}
            required
            size="small"
            value={enquiry.description}
            name="description"
            onChange={handelChange}
          />
          <br />
          <br />
          <label>Number: </label>
          <TextField
            required
            id="outlined-required"
            label="Number"
            placeholder="Number"
            size="small"
            value={enquiry.number}
            name="number"
            onChange={handelChange}
            type="number"
          />
          <br />
          <br />
          <Button
            onClick={() => {
              Submit(enquiry);
            }}
            sx={{ marginLeft: "190px" }}
            type="submit"
            variant="contained"
            size="small"
          >
            Submit
          </Button>
          <br />
          <br />
        </Box>
      </Paper>
    </div>
  );
};

export default Contact;
