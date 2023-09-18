import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, Rating, Typography } from "@mui/material";
import { CgProfile } from "react-icons/cg";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const SpareSeperate = () => {
  const [spare, setSpare] = useState([]);
  const [data, setData] = useState({});
  const [reviews, setReviews] = useState([]);
  const params = useParams();

  const storeData = useSelector((state) => {
    return state.item;
  });

  console.log(params);
  useEffect(() => {
    setData(storeData);

    axios
      .get(`https://unistore.onrender.com/api/getspares/${params.id}`)
      .then((res) => {
        setSpare(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`https://unistore.onrender.com/api/getreview/${params.id}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(spare, "spare");
  return (
    <div style={{ margin: "20px" }}>
      {spare.map((spare) => {
        return (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid xs={4}>
                <Item>
                  <Paper elevation={8}>
                    <Box sx={{ height: "50%" }}>
                      <img alt="" src={spare.image} style={{ width: "100%" }} />
                    </Box>
                  </Paper>
                </Item>
              </Grid>
              <Grid xs={8}>
                <Item>
                  <Paper elevation={8}>
                    <Typography variant="h3">
                      Product-Name:{spare.name}
                    </Typography>
                    <hr />
                    <br />
                    <Typography variant="h4">
                      Brand:
                      {data.brands.map((ele) => {
                        if (data.brand === ele._id) {
                          return ele.brand;
                        }
                      })}
                    </Typography>
                    <br />
                    <Typography variant="h4">
                      Category:
                      {data.categories.map((category) => {
                        if (data.category === category._id) {
                          return category.category;
                        }
                      })}
                    </Typography>
                    <br />
                    <Typography variant="h5">Compactable Models:</Typography>
                    <br />
                    <hr />
                    {spare.compactableModels.map((ele) => {
                      return (
                        <Typography variant="h5">
                          {ele.brand} : {ele.model}
                        </Typography>
                      );
                    })}
                    <hr />
                    <Typography variant="h4">
                      Warrenty:{spare.warrenty}
                    </Typography>
                    <br />
                    <Typography variant="h4">
                      Description:{spare.description}
                    </Typography>
                    <br />
                    <Typography variant="h4">Price: ₹{spare.price}</Typography>
                    <br />
                    <Typography
                      color={spare.stock > 5 ? "#51FF00" : "red"}
                      variant="h4"
                    >
                      Stock:{spare.stock}
                    </Typography>
                    <br />
                    <Link to="/spares">
                      <Button variant="contained">Back to Product</Button>
                    </Link>
                    <br />
                    <br />
                  </Paper>
                </Item>
              </Grid>
            </Grid>
          </Box>
        );
      })}
      <div>
        <Typography variant="h5">Reviews:</Typography>
        <br />
        {reviews.map((ele) => {
          return (
            <div>
              <Typography variant="body1">
                <CgProfile size="20px" />
                {ele.userid}
              </Typography>
              <br />
              <Rating name="read-only" value={ele.rating} readOnly />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpareSeperate;
