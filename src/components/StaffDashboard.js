import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
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

const StaffDashboard = () => {
  const [data, setData] = React.useState([]);
  console.log(data, "data");

  const events = [{ title: "Meeting", start: new Date() }];

  React.useEffect(() => {
    axios
      .get("https://unistore.onrender.com/api/getservices", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {});
  }, []);

  const reducedData = data.reduce((pv, cv) => {
    console.log(cv.updatedAt.toString());
    if (cv.serviceAccepted === true) {
      const obj = {
        title: cv.description + ` - model: ${cv.model}`,
        start: cv.updatedAt,
      };
      pv.push(obj);
      return pv;
    }
    return pv;
  }, []);

  console.log(reducedData, "red");

  return (
    <div style={{ margin: "15px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={8} sx={{ width: "75%" }}>
            <Paper elevation={8}>
              <Item>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  weekends={false}
                  events={reducedData}
                />
              </Item>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default StaffDashboard;
