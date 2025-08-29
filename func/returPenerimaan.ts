import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getAllReturPenerimaanRequest = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockrpurch/dataall?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`,{headers:headers}
    );

    return response.data.dataStockRPurch;
  } catch (error) {
    console.error("Error retur penerimaan request:", error);
    throw error;
  }
};

export const getReturRequestByID = async (wherelike:string) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockrpurch/getstockrpurchbyid?id=${wherelike}`,{
        headers:headers
      }
    );

    return response.data.dataStockRPurch;
  } catch (error) {
    console.error("Error retur penerimaan request:", error);
    throw error;
  }
};

export const getReturDetailRequestByID = async (wherelike:string) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockrpurch/getstockpurchdetailbyid?id=${wherelike}`,{
        headers:headers
      }
    );

    return response.data.dataStockPurchDetail;
  } catch (error) {
    //console.log(`${baseUrl}stockrpurch/getstockpurchdetailbyid?id=${wherelike}`);
    console.error("Error retur penerimaan detail request:", error);
    throw error;
  }
};

export const getAllReturPerItemRequest = async (option:string,like:string,pembayaran:string,optionfilter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,pageprev:number,page:number) => {
  try {
    const response = await axios.get(
      `${baseUrl}stockrpurch/getstockperitem?option=${option}&like=${like}&pembayaran=${pembayaran}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`,{
        headers:headers
      }
    );

    return response.data.dataStockRPurch;
  } catch (error) {
    //console.log(`${baseUrl}stockrpurch/getstockperitem?option=${option}&like=${like}&pembayaran=${pembayaran}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`);
    console.error("Error retur penerimaan peritem request:", error);
    throw error;
  }
};

export const printPesananRequest = async (kode:string) => {
 
  return `${baseUrl}stockrpurch/printlaporanbyid?nomorinv=${kode}`;
   
}


export const printReturAllRequest = async (option:string,like:string,pembayaran:string,optionfilter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,pageprev:number,page:number) => {
  console.log(`${baseUrl}stockrpurch/printlaporanall?option=${option}&like=${like}&pembayaran=${pembayaran}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`);
  return `${baseUrl}stockrpurch/printlaporanall?option=${option}&like=${like}&pembayaran=${pembayaran}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`;
   
}






