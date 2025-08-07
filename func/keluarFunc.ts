import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getAllKeluarRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string,darigudang:string,kegudang:string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockout/all?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`, { headers: headers }
        );

        return response.data.dataStockOut;
    } catch (error) {
        console.error("Error keluar request:", error);
        throw error;
    }
};

export const getAllKeluarPerItemRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string,darigudang:string,kegudang:string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockout/dataitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`, { headers: headers }
        );
        //console.log(`${baseUrl}stockout/dataitem?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`);
        return response.data.dataStockOut;
    } catch (error) {
        console.error("Error terima request:", error);
        throw error;
    }
};

export const getAllKeluarRequestbyId = async (wherelike: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockout/detail?id=${wherelike}`, {
            headers: headers
        }
        );

        return response.data.dataStockOut;
    } catch (error) {
        console.error("Error keluar request:", error);
        throw error;
    }
};

export const getAllKeluarDetailRequestbyId = async (wherelike: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockout/stockoutdetail?id=${wherelike}`, {
            headers: headers
        }
        );

        return response.data.dataStockOutDetail;
    } catch (error) {
        console.error("Error keluar request:", error);
        throw error;
    }
};


export const printPesananRequest = async (kode:string) => {
 
  return `${baseUrl}stockout/printlaporanbyid?nomorinv=${kode}`;
   
}

export const printAllRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,darigudang:string,kegudang:string) => {
  //console.log(`${baseUrl}stockout/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`);
  return `${baseUrl}stockout/printlaporan?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&darigudang=${darigudang}&kegudang=${kegudang}`;
}