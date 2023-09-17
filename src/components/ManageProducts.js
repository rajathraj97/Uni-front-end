import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CreateProduct from './CreateProduct';
import CreateSpare from './CreateSpare'


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const Manageproducts = () =>{
    return<div style={{margin:"15px"}}>
             <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid xs={5.2}>
        <Paper elevation={6}>
          <Item><CreateProduct/></Item>
          </Paper>
        </Grid>
        
        <Grid xs={5.2}>
        <Paper elevation={6}> <Item>
          <CreateSpare/>
          </Item>
        </Paper>
        </Grid>
        
      </Grid>
    </Box>
    </div>
}

export default Manageproducts