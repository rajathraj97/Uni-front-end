import axios from "axios";

export const getServices = (userData) => {
  return async (dispatch) => {
    try {
      const id = userData.tokendata._id;

      if (userData.tokendata._id) {
        const service = await axios.get(
          `http://localhost:3001/api/getservices/${id}`,
          { headers: { Authorization: userData.token } }
        );

        dispatch(getService(service.data));
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const getServicesRefresh = (id, token) => {
  return async (dispatch) => {
    try {
      const service = await axios.get(
        `http://localhost:3001/api/getservices/${id}`,
        { headers: { Authorization: token } }
      );

      dispatch(getService(service.data));
    } catch (e) {
      console.log(e);
    }
  };
};

export const addService = (tokendata, formData, globalData) => {
  return async (dispatch) => {
    try {
      const token = tokendata;

      const postData = {
        userid: globalData._id,
        courier: formData.courier,
        trackingnumber: formData.trackingnumber,
        description: formData.problem,
        model: formData.model,
      };

      const add = await axios.post(
        "http://localhost:3001/api/createservice",
        postData,
        { headers: { Authorization: token } }
      );
    } catch (e) {
      console.log(e);
    }
  };
};

const getService = (data) => {
  return { type: "FETCH_SERVICES", payload: data };
};
