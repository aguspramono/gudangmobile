import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getAllMutasiRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string,darigudang:string,kegudang:string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockin?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`, { headers: headers }
        );

        return response.data.dataStockIn;
    } catch (error) {
        //console.log(`${baseUrl}stockin?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`)
        console.error("Error mutasi request:", error);
        throw error;
    }
};


export const getAllMutasiItemRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string,darigudang:string,kegudang:string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockin/dataitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`, { headers: headers }
        );

        return response.data.dataStockInItem;
    } catch (error) {
        //console.log(`${baseUrl}stockin?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`)
        console.error("Error mutasi request:", error);
        throw error;
    }
};

export const getAllMutasiRequestbyId = async (wherelike:string) => {
    try {
      const response = await axios.get(
        `${baseUrl}stockin/detail?id=${wherelike}`,{
          headers:headers
        }
      );
      return response.data.dataStockIn;
    } catch (error) {
        console.error("Error mutasi request:", error);
        throw error;
    }
};

export const getAllMutasiDetailRequestbyId = async (wherelike:string) => {
    try {
      const response = await axios.get(
        `${baseUrl}stockin/stockindetail?id=${wherelike}`,{
          headers:headers
        }
      );
  
      return response.data.dataStockInDetail;
    } catch (error) {
        console.error("Error mutasi request:", error);
        throw error;
    }
};

export const printPesananRequest = async (kode:string) => {
 
  return `${baseUrl}stockin/printlaporanbyid?nomorinv=${kode}`;
   
}

export const printAllRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,darigudang:string,kegudang:string) => {
  //console.log(`${baseUrl}stockpurch/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pilihan=${pilihan}`);
  return `${baseUrl}stockin/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`;
}