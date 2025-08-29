import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getAllTerimaRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockpurch/all?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`, { headers: headers }
        );

        return response.data.dataStockPurch;
    } catch (error) {
        console.error("Error terima request:", error);
        throw error;
    }
};

export const getAllTerimaPerItemRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockpurch/dataperitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`, { headers: headers }
        );

        return response.data.dataStockPurchPerItem;
    } catch (error) {
        console.error("Error terima request:", error);
        throw error;
    }
};


export const getAllTerimaRequestbyId = async (wherelike:string) => {
    try {
      const response = await axios.get(
        `${baseUrl}stockpurch/detail?id=${wherelike}`,{
          headers:headers
        }
      );
  
      return response.data.dataStockPurch;
    } catch (error) {
        console.log( `${baseUrl}stockpurch/detail?id=${wherelike}`)
        console.error("Error terima request:", error);
        throw error;
    }
};

export const getAllTerimaDetailRequestbyId = async (wherelike:string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockpurchdetail/detail?id=${wherelike}`,{
            headers:headers
            }
        );
  
        return response.data.dataStockPurchDetail;
    } catch (error) {
        console.log(`${baseUrl}stockpurchdetail/detail?id=${wherelike}`)
        console.error("Error terima request:", error);
        throw error;
    }
};

export const printPesananRequest = async (kode:string) => {
  return `${baseUrl}stockpurch/printlaporanbyid?nomorinv=${kode}`;
}

export const printAllRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,pilihan:string) => {
  //console.log(`${baseUrl}stockpurch/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pilihan=${pilihan}`);
  return `${baseUrl}stockpurch/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pilihan=${pilihan}`;
}