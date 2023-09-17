import { useState } from "react"
import { useSelector } from "react-redux"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Button, Card, CardActions, CardContent, CardMedia, TextField, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { RoleContext } from "../App";
import { addItems, getItems } from "./redux-actions/items";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const Product = (props) =>{
    const[token,setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token'):"")
    const[brand, setBrand] = React.useState('');
    const[sort,setSort] =  React.useState('')
    const[category,setCategory] = React.useState('')
    const[quantity,setQuantity] = React.useState(1)
    const[products,setProducts] = React.useState([])
    const[searchString,setSearch] = React.useState("")
    const[togle,setToggle] = useState(false)
    const[globalData,setGlobalData] = React.useState(localStorage.getItem('globaldata') ? JSON.parse(localStorage.getItem('globaldata')) : '')
    const limit = [1,2,3,4,5]
    const [open, setOpen] = React.useState(false);
    const imageURL = "https://images.unsplash.com/photo-1604937455095-ef2fe3d46fcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29sb3JmdWwlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&w=1000&q=80"

    const handleClick = () => {
      setOpen(true);
    }
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
  
    const dispatch = useDispatch()

    console.log(globalData,'global data in product')


    console.log(searchString,'searchString')

    React.useEffect(()=>{
      if(searchString.length >= 2){
      console.log(searchString,'in condition')
      const result = products.filter((ele)=>{return ele.name.includes(searchString)})
      console.log(result,'result')
      if(result.length >= 1){
      setProducts(result)
    }
    }
      else if(searchString === ""){
        setProducts(product)
      }
    },[searchString])
     
    console.log(products,'prod')
   
  React.useEffect(()=>{
    setSearch(props.search)
  },[props.search])

  React.useEffect(()=>{
    dispatch(getItems())
  },[localStorage.getItem('token')])



   const userData = React.useContext(RoleContext) //Object with token and userData
   const updateToggle = userData.updateToggle
   const toggle = userData.toggle
    console.log(userData,'products')   

    const brands = useSelector((state)=>{
        return state.item.brands
    },[token])
    

    let product = useSelector((state)=>{
      console.log(state,'state in product')
      return state.item.products
     },[token])

     useState(()=>{
      setProducts(product)
     },[])

     console.log(product,'product')

    let productCopy = useSelector((state)=>{
    return state.item.products
    },[token])

    let categories = useSelector((state)=>{
        return state.item.categories
    })
    

    const handleChange = (event) => {
      setBrand(event.target.value);
      setToggle(!toggle)
    };

    const handleChangeSort = (event) => {
      setSort(event.target.value);
    };
    const handleChangeCategory = (event) => {
      setCategory(event.target.value);
    };

    const addProducts = (id,userData,quantity) =>{
      
      console.log(id,'in event')
      dispatch(addItems(id,userData,quantity))
      updateToggle(!toggle)
      setQuantity(1)
    }

    const handelSelect = (e) =>{
      setQuantity(e.target.value)
    }
    console.log(quantity)
    
    
  //Brand filter
    if(brand === "None"){
      product = productCopy
    }else if(!(brand === '')){
      product = product.reduce((pv,cv)=>{
        if(cv.brand === brand){
          pv.push(cv)
        }
        return pv
      },[])
      console.log(product,'in condition')
    }
//Price Filter
    if(sort === ""){
      product = productCopy
    }
    if(sort === "low"){
      product = product.sort(function(a,b){
        return a.price - b.price
      })
    }else if(sort === "high"){
      product = product.sort(function(a,b){
        return b.price - a.price
      })
    }
  //category filter
  if(category === "none"){
    product = productCopy
  }else if(!(category === "")){
    product = product.reduce((pv,cv)=>{
      if(cv.category === category){
        pv.push(cv)
      }
      return pv
    },[])
  }

   
 
 

    
    return(<Box sx={{position:'absolute',width:"100%",height:"100%",backgroundImage:`url(${imageURL})`,backgroundPosition:'center',backgroundSize:'cover',backgroundRepeat:'repeat'}}><div style={{margin:"25px"}}>
      
       <Box sx={{ minWidth: 120 }}>
       <Grid container rowSpacing={1} columnSpacing={{ xs: 3, sm: 3, md: 3 }}>
       <Grid xs={0.5}>
       <Typography variant="h5">Filters</Typography>
       </Grid>
      <Grid xs={2.5}><FormControl size="small" fullWidth>
        
        <InputLabel id="demo-simple-select-label">Brand</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Brand"
          value={brand}
          onChange={(e)=>{handleChange(e)}}
        >
          <MenuItem value={"None"} >None</MenuItem>
          {brands.map((brand,i)=>{
            return <MenuItem value={brand._id} key={i}>{brand.brand}</MenuItem>
          })}
        </Select>
      </FormControl>
      </Grid>
      <Grid xs={2}>
      <FormControl size="small" fullWidth>
        <InputLabel id="demo-simple-select-label">Price</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Price"
          value={sort}
          onChange={handleChangeSort}
        >
          <MenuItem value={""}>None</MenuItem>
          <MenuItem value={"low"}>Low to High</MenuItem>
          <MenuItem value={"high"}>High to Low</MenuItem>
        </Select>
      </FormControl>
      </Grid>
      <Grid xs={2}>
      <FormControl size="small" fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Price"
          value={category}
          onChange={handleChangeCategory}
        >
          <MenuItem value={"none"}>None</MenuItem>
          {categories.map((cat,i)=>{
            return <MenuItem key={i} value={cat._id}>{cat.category}</MenuItem>
          })}
        </Select>
      </FormControl>
      </Grid>
      </Grid>
</Box>

<Box sx={{ minWidth: 120 }}>
       <Grid container rowSpacing={1.5} columnSpacing={{ xs: 6, sm: 6, md: 6 }}>
      <Grid xs={2}></Grid>
      </Grid>
    </Box>
       
      <hr/>
      
    <Box sx={{ width: '100%' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 3, sm: 6, md: 5 }}>
      {product.map((product,i)=>{
        return  <Grid xs={2.4} key={i}>
          
        <Item><Paper elevation={9}> 
        <Card sx={{ maxWidth: 355 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={product.image[0]}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         {product.description}
        </Typography>
        <hr/>
        <Typography variant="h5" color="black">
         PRICE: ₹{product.price}
        </Typography>
        <hr/>
        <Typography variant="body2" color="black">
         Quantity: <select onChange={handelSelect}>
          {limit.map((ele,i)=>{
            return <option key={i} value={ele}>{ele}</option>
          })}
         </select>
        </Typography>
      </CardContent>
      <CardActions>
      
      <Button variant="contained"  onClick={()=>{addProducts(product._id,globalData,quantity);handleClick()}} color='warning'>Add to Cart<AddShoppingCartIcon/></Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Added Product To cart
        </Alert>
      </Snackbar>
      <Link to={`/product/${product._id}`} style={{textDecoration:"none"}}><Button variant="contained"  >View Product</Button></Link>
      </CardActions>
    </Card>
        
        </Paper>
        </Item>
        
        </Grid>
      })}
      
    </Grid>
  </Box></div></Box> )
}

export default Product