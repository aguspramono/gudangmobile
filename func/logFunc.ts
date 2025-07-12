import axios from "axios";
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
