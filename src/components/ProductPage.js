import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, Rating, Typography } from "@mui/material";
import { CgProfile } from "react-icons/cg";

const ProductPage = () => {
  const [product, setProduct] = useState([]);
  const [data, setData] = useState({});
  const [reviews, setReviews] = useState([]);
  const params = useParams();
  const imageURL = "https://images.unsplash.com/photo-1604937455095-ef2fe3d46fcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29sb3JmdWwlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&w=1000&q=80"

  const storeData = useSelector((state) => {
    return state.item;
  });

  useEffect(() => {
    setData(storeData);
    axios
      .get(`https://unistore.onrender.com/api/getreview/${params.id}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(reviews, "dta");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    axios
      .get(`https://unistore.onrender.com/api/getoneproduct/${params.id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {});
  }, []);
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
      <div style={{ margin: "20px" }}>
        {product.map((product) => {
          return (
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={4}>
                  <Item>
                    <Paper elevation={8}>
                      <Box sx={{ height: "50%" }}>
                        <img
                          alt=""
                          src={product.image}
                          style={{ width: "100%" }}
                        />
                      </Box>
                    </Paper>
                  </Item>
                </Grid>
                <Grid xs={8}>
                  <Item>
                    <Paper elevation={8}>
                      <Typography variant="h4">
                        Product-Name:{product.name}
                      </Typography>
                      <hr />
                      <br />
                      <Typography variant="body1">
                        Brand:
                        {data.brands.map((ele) => {
                          if (product.brand === ele._id) {
                            return ele.brand;
                          }
                        })}
                      </Typography>
                      <br />
                      <Typography variant="body1">
                        Category:
                        {data.categories.map((category) => {
                          if (product.category === category._id) {
                            return category.category;
                          }
                        })}
                      </Typography>
                      <br />
                      <Typography variant="body1">Info:</Typography>
                      <br />
                      <hr />
                      {product.info.map((ele) => {
                        return (
                          <Typography variant="body1">
                            {ele.productinfo} : {ele.productvalue}
                          </Typography>
                        );
                      })}
                      <hr />
                      <Typography variant="body1">
                        Warrenty:{product.warrenty}
                      </Typography>
                      <br />
                      <Typography variant="body1">
                        Description:{product.description}
                      </Typography>
                      <br />
                      <Typography variant="body1">
                        Price: ₹{product.price}
                      </Typography>
                      <br />
                      <Typography
                        color={product.stock > 5 ? "#51FF00" : "red"}
                        variant="h4"
                      >
                        Stock:{product.stock}
                      </Typography>
                      <br />
                      <Link to="/product">
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
                <Paper elevation={8}>
                  <Typography variant="body1">
                    <CgProfile color="green" size="20px" /> {ele.userid}{" "}
                  </Typography>
                  <br />
                  <Rating name="read-only" value={ele.rating} readOnly />
                </Paper>
                <br />
                <br />
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
};

export default ProductPage;
