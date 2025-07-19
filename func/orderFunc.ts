import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};


export const getAllOrderRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string) => {
  try {
    const response = await axios.get(`${baseUrl}stockpo/alldata?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`,{ headers });
    return response.data.datastockpo;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
};

export const getOrderRequestByID = async(nopo:string) =>{
  try {
    const response = await axios.get(
      `${baseUrl}stockpo/detail?id=${nopo}`,{
        headers:headers
      }
    );

    return response.data.dataStockPo;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
}


export const getOrderDetailRequestByID = async(nopo:string) =>{
  try {
    const response = await axios.get(
      `${baseUrl}stockpodetail/detailponly?id=${nopo}`,{
        headers:headers
      }
    );

    return response.data.dataStockPoDetail;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
}

export const printPesananRequest = async (kode:string) => {
 
  return `${baseUrl}stockpo/printlaporanbyid?nomorinv=${kode}`;
   
}