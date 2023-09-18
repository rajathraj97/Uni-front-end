import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { InputLabel, TextField, useScrollTrigger } from "@mui/material";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { RoleContext } from "../App";

const CreateSpare = () => {
  const [file, setFile] = React.useState("");
  const [category, setCategory] = React.useState([]);
  const [data, setData] = React.useState({
    name: "",
    category: "",
    stock: null,
    warrenty: "",
    price: null,
    productDetails: [],
    compactableModels: [],
    description: "",
  });
  const [modelInfo, setModelInfo] = React.useState({ brand: "", model: "" });
  const [productDetais, setProductDetails] = React.useState({
    productinfo: "",
    productvalue: "",
  });

  const globalData = React.useContext(RoleContext);

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getcategory")
      .then((res) => {
        setCategory(res.data, "spare category");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "price") {
      setData({ ...data, price: parseInt(e.target.value) });
    }
    if (e.target.name === "stock") {
      setData({ ...data, stock: parseInt(e.target.value) });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const compactableModels = (e) => {
    setModelInfo({ ...modelInfo, [e.target.name]: e.target.value });
  };

  const handelModel = (modelinfo) => {
    data.compactableModels.push(modelInfo);
    setModelInfo({ brand: "", model: "" });
  };
  const removeModels = (index) => {
    const result = data.compactableModels.filter((ele, i) => {
      return i !== index;
    });
    setData({ ...data, compactableModels: result });
  };

  const handelProductinfo = (e) => {
    setProductDetails({ ...productDetais, [e.target.name]: e.target.value });
  };

  const createNewCategory = async () => {
    const { value: category } = await Swal.fire({
      title: "Enter Category",
      input: "text",
      inputLabel: "Enter Category",
      inputPlaceholder: "Enter Category",
    });

    if (category) {
      Swal.fire(`New Category: ${category}`);
    }
  };

  const addProductInfo = (productinfo) => {
    data.productDetails.push(productinfo);
    setProductDetails({ productinfo: "", productdetails: "" });
  };

  const removeDetails = (index) => {
    const result = data.productDetails.filter((ele, i) => {
      return i !== index;
    });
    setData({ ...data, productDetails: result });
  };

  const createNewSpare = (globalData, file, data) => {
    if (data.name.length <= 0 || data.stock <= 0 || data.price <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Oops All Mandatory fields not filled!",
      });
    } else {
      console.log(data, "data in spare");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("stock", data.stock);
      formData.append("warrenty", data.warrenty);
      formData.append("price", data.price);
      formData.append("productDetails", JSON.stringify(data.productDetails));
      formData.append(
        "compactableModels",
        JSON.stringify(data.compactableModels)
      );
      formData.append("description", data.description);
      formData.append("file", file);

      axios
        .post("https://unistore.onrender.com/api/createspare", formData, {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.hasOwnProperty("_id")) {
            Swal.fire("added sucessfully");
            setData({
              name: "",
              category: "",
              stock: null,
              warrenty: "",
              price: null,
              productDetails: [],
              compactableModels: [],
              description: "",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  console.log(category);
  return (
    <div>
      <h4>Create Spare</h4>
      <Card sx={{ maxWidth: 780 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={
            file
              ? "https://en.pimg.jp/057/691/915/1/57691915.jpg"
              : "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg"
          }
        />
        <CardContent>
          <form action="/" method="post" encType="multipart/form-data">
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              name="file"
            />
            <br />
            <br />
            Name :{" "}
            <TextField
              required
              value={data.name}
              id="standard-basic"
              onChange={handleChange}
              name="name"
              size="small"
              label="Product-Name"
              variant="standard"
            />
            <br />
            Category:
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Category
              </InputLabel>
              <Select
                required
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={data.category}
                onChange={handleChange}
                label="Category"
                name="category"
              >
                {category.map((ele, i) => {
                  return (
                    <MenuItem key={i} value={ele._id}>
                      {ele.category}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <br />
            <Button
              variant="contained"
              onClick={createNewCategory}
              size="small"
              color="success"
            >
              Create New Category
            </Button>
            <br />
            <br />
            Warrenty:{" "}
            <TextField
              required
              value={data.warrenty}
              id="standard-basic"
              label="Warrenty"
              size="small"
              name="warrenty"
              onChange={handleChange}
              variant="standard"
            />
            <br />
            Price:{" "}
            <TextField
              required
              type="number"
              value={data.price}
              id="standard-basic"
              label="price"
              size="small"
              name="price"
              onChange={handleChange}
              variant="standard"
            />
            <br />
            Stock:{" "}
            <TextField
              required
              type="number"
              value={data.stock}
              id="standard-basic"
              label="stock"
              size="small"
              name="stock"
              onChange={handleChange}
              variant="standard"
            />
            <br />
            Product-Details
            <br />
            <TextField
              id="standard-basic"
              value={productDetais.productinfo}
              onChange={handelProductinfo}
              name="productinfo"
              label="info"
              size="small"
              variant="standard"
            />{" "}
            :{" "}
            <TextField
              value={productDetais.productdetails}
              onChange={handelProductinfo}
              name="productdetails"
              id="standard-basic"
              label="details"
              size="small"
              variant="standard"
            />
            <Button
              size="small"
              color="success"
              onClick={() => {
                addProductInfo(productDetais);
              }}
              variant="contained"
            >
              Add Info
            </Button>
            <br />
            <br />
            {data.productDetails.map((ele, i) => {
              return (
                <h6>
                  {ele.productinfo}:{ele.productdetails}
                  <button
                    onClick={() => {
                      removeDetails(i);
                    }}
                  >
                    remove
                  </button>
                </h6>
              );
            })}
            Compactable - Models <br />
            <TextField
              value={modelInfo.brand}
              onChange={compactableModels}
              id="standard-basic"
              name="brand"
              label="brand"
              size="small"
              variant="standard"
            />{" "}
            :{" "}
            <TextField
              onChange={compactableModels}
              name="model"
              value={modelInfo.model}
              id="standard-basic"
              label="model"
              size="small"
              variant="standard"
            />
            <Button
              size="small"
              color="success"
              onClick={() => {
                handelModel(modelInfo);
              }}
              variant="contained"
            >
              Add Info
            </Button>
            <br />
            <br />
            {data.compactableModels.map((ele, i) => {
              return (
                <h6>
                  {ele.brand}:{ele.model}
                  <button
                    size="small"
                    onClick={() => {
                      removeModels(i);
                    }}
                  >
                    remove
                  </button>
                </h6>
              );
            })}
            Description:
            <TextField
              required
              id="filled-multiline-static"
              label="Multiline"
              multiline
              rows={4}
              name="description"
              value={data.description}
              variant="filled"
              onChange={handleChange}
            />
          </form>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              createNewSpare(globalData, file, data);
            }}
            variant="contained"
          >
            Create Spare
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default CreateSpare;
