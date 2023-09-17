import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { MenuItem, Select, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { RoleContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { set } from "mongoose";
import { getItems } from "./redux-actions/items";

const CreateProduct = () => {
  const [file, setFile] = React.useState("");
  const [data, setData] = React.useState({
    name: "",
    info: [],
    category: "",
    subCategory: "",
    brand: "",
    price: null,
    warrenty: "",
    stock: null,
    description: "",
    gst: null,
    minTracking: null,
  });
  const [subCategory, setSubCategory] = React.useState([]);
  const [toggle, setToggle] = React.useState(false);
  const [brand, setBrand] = React.useState([]);
  const [info, setInfo] = React.useState({ productinfo: "", productvalue: "" });
  const [category1, setCategory1] = React.useState(
    useSelector((state) => {
      return state.item.categories;
    }, [])
  );

  const dispatch = useDispatch();

  const handelChange = (e) => {
    if (e.target.name === "stock") {
      setData({ ...data, stock: parseInt(e.target.value) });
    }
    if (e.target.name === "price") {
      setData({ ...data, price: parseInt(e.target.value) });
    }
    if (e.target.name === "minTracking") {
      setData({ ...data, minTracking: parseInt(e.target.value) });
    }
    if (e.target.name === "gst") {
      setData({ ...data, gst: parseInt(e.target.value) });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handelObjChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handeladdField = () => {
    data.info.push(info);
    setInfo({ productinfo: "", productvalue: "" });
  };
  const globalData = React.useContext(RoleContext);

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/api/getsubcategory")
      .then((res) => {
        console.log(res, "in promise,create");
        setSubCategory(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setToggle(!toggle);
  }, []);

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/api/getbrands")
      .then((res) => {
        console.log(res, "brand");
        setBrand(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createProduct = (data, file, globalData) => {
    if (data.price === 0 || data.stock === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Price or Gst can ot be 0",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add item!",
      }).then((result) => {
        if (result.isConfirmed) {
          const obj = { ...data, file: file };
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("info", JSON.stringify(data.info));
          formData.append("price", data.price);
          formData.append("gst", data.gst);
          formData.append("brand", data.brand);
          formData.append("category", data.category);
          formData.append("subCategory", data.subCategory);
          formData.append("stock", data.stock);
          formData.append("warrenty", data.warrenty);
          formData.append("minTracking", data.minTracking);
          formData.append("description", data.description);
          formData.append("file", file);

          axios
            .post("http://localhost:3001/api/createproduct", formData, {
              headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              console.log(res);
              if (res.data.hasOwnProperty("_id")) {
                Swal.fire("Product added sucessfully");
                setData({
                  name: "",
                  info: [],
                  category: "",
                  subCategory: "",
                  brand: "",
                  price: "",
                  warrenty: "",
                  stock: "",
                  description: "",
                  gst: "",
                  minTrackin: 0,
                });
                setFile("");
              } else {
                Swal.fire("an unknown error occured");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  const addCategory = async (globalData) => {
    const { value: category } = await Swal.fire({
      title: "Input Category",
      input: "text",
      inputLabel: "Enter Category",
      inputPlaceholder: "Enter your email address",
    });

    if (category) {
      Swal.fire(`Entered email: ${category}`);
      axios
        .post(
          "http://localhost:3001/api/createcategory",
          { category: category },
          { headers: { Authorization: globalData.token } }
        )
        .then((res) => {
          if (res.data.hasOwnProperty("_id")) {
            Swal.fire("Added sucessfully");
            axios
              .get("http://localhost:3001/api/getcategory")
              .then((res) => {
                setCategory1(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const addSubCategory = async (globalData) => {
    const { value: SubCategory } = await Swal.fire({
      title: "Input sub-Category",
      input: "text",
      inputLabel: "Enter sub-Category",
      inputPlaceholder: "Enter your subCategory",
    });

    if (SubCategory) {
      Swal.fire(`Entered email: ${SubCategory}`);
      axios
        .post(
          "http://localhost:3001/api/createsubcategory",
          { subCategory: SubCategory },
          { headers: { Authorization: globalData.token } }
        )
        .then((res) => {
          if (res.data.hasOwnProperty("_id")) {
            Swal.fire("added sucessfully");
            axios
              .get("http://localhost:3001/api/getsubcategory")
              .then((res) => {
                setSubCategory(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const createBrand = async (globalData) => {
    const { value: Brand } = await Swal.fire({
      title: "Input Brand",
      input: "text",
      inputLabel: "Enter Brand",
      inputPlaceholder: "Enter Brand",
    });

    if (Brand) {
      Swal.fire(`Entered Brand: ${Brand}`);
      axios
        .post(
          "http://localhost:3001/api/createbrand",
          { brand: Brand },
          { headers: { Authorization: globalData.token } }
        )
        .then((res) => {
          if (res.data.hasOwnProperty("_id")) {
            Swal.fire("added sucessfully");
            axios
              .get("http://localhost:3001/api/getbrands")
              .then((res) => {
                setBrand(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      <form
        action="/api/createproduct"
        enctype="multipart/form-data"
        method="post"
      >
        <h4>Create Product</h4>
        <Card sx={{ maxWidth: 780 }}>
          <CardMedia
            sx={{ height: 140 }}
            image={
              file
                ? "https://en.pimg.jp/057/691/915/1/57691915.jpg"
                : "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg"
            }
            title="green iguana"
          />
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <CardContent>
            Product Name :
            <TextField
              onChange={handelChange}
              value={data.name}
              name="name"
              id="standard-helperText"
              label="Product-Name"
              variant="standard"
              size="small"
            />
            <br />
            <br />
            <TextField
              id="standard-basic"
              value={info.productinfo}
              name="productinfo"
              onChange={handelObjChange}
              size="small"
              label="Product-info"
              variant="standard"
            />{" "}
            :{" "}
            <TextField
              value={info.productvalue}
              onChange={handelObjChange}
              name="productvalue"
              size="small"
              id="standard-basic"
              label="Product-Value"
              variant="standard"
            />
            <Button
              onClick={handeladdField}
              variant="contained"
              color="success"
              size="small"
            >
              Add Data
            </Button>
            {data.info.map((ele) => {
              return (
                <h6>
                  {ele.productinfo}:{ele.productvalue}
                </h6>
              );
            })}
            <br />
            <br />
            <br />
            Category:
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              name="category"
              onChange={handelChange}
              value={data.category}
              size="small"
            >
              <MenuItem value={0}>---Select---</MenuItem>
              {category1.map((ele, i) => {
                return (
                  <MenuItem key={i} value={ele._id}>
                    {ele.category}
                  </MenuItem>
                );
              })}
            </Select>
            <Button
              onClick={() => addCategory(globalData)}
              variant="contained"
              color="success"
              size="small"
            >
              Create New Category
            </Button>
            <br />
            <br />
            SubCategory:
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              name="subCategory"
              onChange={handelChange}
              value={data.subCategory}
              size="small"
            >
              <MenuItem value={0}>---Select---</MenuItem>
              {subCategory.map((ele, i) => {
                return (
                  <MenuItem key={i} value={ele._id}>
                    {ele.subCategory}
                  </MenuItem>
                );
              })}
            </Select>
            <Button
              onClick={() => {
                addSubCategory(globalData);
              }}
              variant="contained"
              color="success"
              size="small"
            >
              Create New SubCategory
            </Button>
            <br />
            Brand:
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              name="brand"
              onChange={handelChange}
              value={data.brand}
              size="small"
            >
              <MenuItem value={0}>---Select---</MenuItem>
              {brand.map((ele, i) => {
                return (
                  <MenuItem key={i} value={ele._id}>
                    {ele.brand}
                  </MenuItem>
                );
              })}
            </Select>
            <Button
              onClick={() => {
                createBrand(globalData);
              }}
              color="success"
              size="small"
              variant="contained"
            >
              Create Brand
            </Button>
            <br />
            Price:
            <TextField
              id="price"
              label="Product-Price"
              variant="standard"
              size="small"
              type="number"
              required
              value={data.price}
              onChange={handelChange}
              name="price"
            />
            <br />
            Warrenty:
            <TextField
              id="standard-helperText"
              label="Product-Warrenty"
              defaultValue="Default Value"
              variant="standard"
              size="small"
              required
              value={data.warrenty}
              onChange={handelChange}
              name="warrenty"
            />
            <br />
            Gst:
            <TextField
              id="standard-helperText"
              label="Product-Gst"
              variant="standard"
              size="small"
              type="number"
              required
              value={data.gst}
              onChange={handelChange}
              name="gst"
            />
            <br />
            Stock:
            <TextField
              id="standard-helperText"
              label="Product-Stock"
              variant="standard"
              size="small"
              type="number"
              required
              value={data.stock}
              onChange={handelChange}
              name="stock"
            />
            <br />
            Min Stock for Notificatio:
            <TextField
              id="standard-helperText"
              label="Min stock for notification"
              variant="standard"
              size="small"
              required
              type="number"
              inputProps={{ maxLength: 12 }}
              value={data.minTracking}
              onChange={handelChange}
              name="minTracking"
            />
            <br />
            Description:{" "}
            <TextField
              id="filled-multiline-static"
              label="Multiline"
              multiline
              rows={4}
              variant="filled"
              required
              value={data.description}
              onChange={handelChange}
              name="description"
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                createProduct(data, file, globalData);
              }}
            >
              Create Product
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};
export default CreateProduct;
