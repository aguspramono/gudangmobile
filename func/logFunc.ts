import axios from "axios";
import { getToken } from './global/authStorage';
import { router } from "expo-router";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const logRequest = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    console.log(error);
      console.log("❌ Axios Error");
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Headers:", error.response.headers);
        console.log("Data:", error.response.data);
      } else if (error.request) {
        console.log("No response received from server");
        console.log("Request:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
      throw error;
    //throw error;
  }
};

export const checkToken = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/checktoken`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    throw error;
  }
};


export const getDatauserFun = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/getdatauser`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    throw error;
  }
};


export const updatePassFunc = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/changepass`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    throw error;
  }
};

export const updateProfFunc = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/changeprof`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    throw error;
  }
};



export const deleteTokenNotifUser = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/deletetokennotif`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    throw error;
  }
};

export const deleteTokenNotifUserByTokenNotif = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/deletetokennotifbytokennotif`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error logging request:", error);
    throw error;
  }
};

export const checkLogin = async () => {
  const token = await getToken();
  console.log(token);
  if(token===null){
    return router.navigate('/');
  }
};






