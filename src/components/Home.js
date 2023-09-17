import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const [spare, setSpare] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/getspares")
      .then((res) => {
        setSpare(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  spare.splice(0, spare.length - 3);

  return (
    <div style={{ margin: "5px" }}>
      <div
        id="carouselExampleIndicators"
        class="carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              src="https://media.licdn.com/dms/image/C5612AQEleR9ezEQcRg/article-cover_image-shrink_720_1280/0/1520184098523?e=2147483647&v=beta&t=7OArONPx08k8XFeQdzQa8qb2y_Le6oTB0Hp3eWqemfo"
              style={{ width: "100%", height: "500px" }}
              class="d-block w-100"
              alt="..."
            />
          </div>
          <div class="carousel-item">
            <img
              src="https://t4.ftcdn.net/jpg/03/03/49/75/360_F_303497515_ZHOwfTtuo5sYpAeoqWRZnkXZNZDKZeMz.jpg"
              style={{ width: "100%", height: "500px" }}
              class="d-block w-100"
              alt="..."
            />
          </div>
          <div class="carousel-item">
            <img
              src="https://rexplastics.com/wp-content/uploads/2019/09/iStock-680194864.jpg"
              style={{ width: "100%", height: "500px" }}
              class="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div style={{ backgroundColor: "#BCBCBC" }}>
        <Typography align="center" variant="h4">
          Newly Added
        </Typography>
        <br />
        <Grid
          container
          rowSpacing={1}
          sx={{ marginLeft: "22px" }}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {spare.map((ele) => {
            return (
              <Grid xs={2}>
                <Item>
                  <div class="card" style={{ width: "17rem" }}>
                    <img src={ele.image[0]} class="card-img-top" alt="..." />
                    <div class="card-body">
                      <h5 class="card-title">Product :{ele.name}</h5>
                      <p class="card-text">Description :{ele.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">Price:{ele.price}</li>
                      <li class="list-group-item">Warrenty:{ele.warrenty}</li>
                    </ul>
                  </div>
                </Item>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
