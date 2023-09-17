import { Box, Button, Paper, Typography } from "@mui/material"
import Avatar from '@mui/material/Avatar';
import { deepOrange} from '@mui/material/colors';
import { useContext } from "react";
import { RoleContext } from "../App";
import { Link } from "react-router-dom";

const Profile = () =>{
const globalData = useContext(RoleContext)

    return(<div style={{margin:"20px"}}>
        
        <Paper sx={{width:1/4 , marginLeft:"40%"}} elevation={9}><Box sx={{border:"1px"}}>
            <Typography align="center" variant="h4">PROFILE-DETAILS</Typography>
            <hr/>
            <Avatar  size="large" sx={{ bgcolor: deepOrange[500] , marginLeft:"45%" }}>{globalData.tokendata.username[0]}</Avatar><br/>
            <Typography align="center" variant="h5">Name:{globalData.tokendata.username}</Typography><br/>
            <Typography align="center" variant="h5">Address:{globalData.tokendata.address}</Typography><br/>
            <Typography align="center" variant="h5">Pincode:{globalData.tokendata.pincode}</Typography><br/>
            <Typography align="center" variant="h5">Email:{globalData.tokendata.email}</Typography><br/>
            <Typography align="center" variant="h5">Mobile:{globalData.tokendata.number}</Typography><br/>
            </Box></Paper>
            <Link to="/contact"><Button sx={{marginLeft:"50%"}}>Contact us</Button></Link>
    </div>)
}

export default Profile