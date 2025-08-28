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
    throw error;
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


export const deleteTokenNotifUser = async (data: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/deletetokennotif`, data, { headers });
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






