import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const getAllPesananRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,status:string) => {
  try {
    const response = await axios.get(`${baseUrl}stockpesanan/all?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&status=${status}`,{ headers });
    return response.data.datastockpesanan;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
};


export const getAllPesananRequestPerItem = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string) => {
  try {
    const response = await axios.get(`${baseUrl}stockpesanan/dataallitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`,{ headers });
    //console.log(`${baseUrl}stockpesanan/dataallitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`);
    return response.data.dataStockPesananItem;
  } catch (error) {
    //console.log(`${baseUrl}stockpesanan/dataallitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`);
    console.error("Error pesanan request:", error);
    throw error;
  }
};

export const getPesananRequestByID = async (wherelike:string) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockpesanan/detail?id=${wherelike}`,{
        headers:headers
      }
    );

    return response.data.dataStockPesanan;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
};

export const getPesananDetailRequestByID = async (wherelike:string) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockpesanandetail/detailnopesonly?id=${wherelike}`,{
        headers:headers
      }
    );

    return response.data.dataStockPesananDetail;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
};

export const updateStatusPesananRequest = async (id:string,status:string,checkuser:string) => {
  try {

    var postData = {
      id:id,
      status:status,
      checkuser:checkuser,
    };

    const response = await axios.post(
      `${baseUrl}stockpesanan/updatestatus`,
      postData,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating pesanan status:", error);
    throw error;
  }
}

export const printPesananRequest = async (kode:string) => {
  return `${baseUrl}stockpesanan/printlaporanbyid?nomorinv=${kode}`;
}

export const printAllRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string) => {
  //console.log(`${baseUrl}stockpesanan/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`);
  return `${baseUrl}stockpesanan/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`;
};

export const checkuserpremis = async(user:string)=>{
  try {
    const response = await axios.get(
      `${baseUrl}stockpesanan/datauserpremis?user=${user}`,{
        headers:headers
      }
    );

    return response.data.dataUser;
  } catch (error) {
    console.error("Error pesanan request:", error);
    throw error;
  }
  
}

