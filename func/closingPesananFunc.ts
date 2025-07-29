import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getAllClosingPesananRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockclosingpesanan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`,{headers:headers}
    );

    return response.data.dataClosePesanan;
  } catch (error) {
    //console.log(`${baseUrl}stockclosingpesanan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`);
    console.error("Error keluar request:", error);
    throw error;
  }
};

export const getAllClosingPesananRequestByid = async (wherelike:string) => {
    try {
      const response = await axios.get(
        `${baseUrl}stockclosingpesanan/detail?id=${wherelike}`,{
          headers:headers
        }
      );
  
      return response.data.dataStockClosingPesanan;
    } catch (error) {
      console.error("Error keluar request:", error);
      throw error;
    }
};

export const getAllClosingPesananDetailRequestByid = async (wherelike:string) => {
    try {
      const response = await axios.get(
        `${baseUrl}stockclosingpesanan/closingpesanandetail?id=${wherelike}`,{
          headers:headers
        }
      );
  
      return response.data.dataStockClosingPesananDetail;
    } catch (error) {
      console.error("Error keluar request:", error);
      throw error;
    }
};
