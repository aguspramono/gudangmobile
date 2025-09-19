import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};


export const getAllData = async (wherelike:string,pageprev:number,page:number,option:string,filter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string) => {
  try {
    const response = await axios.get(`${baseUrl}stocklunashutang/alldatagroup?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`,{ headers });
    return response.data.datalunashutang;
  } catch (error) {
    console.error("Error hutang request:", error);
    throw error;
  }
};


export const getAllDataPembayaran = async (optionlike:string,wherelike:string,optionfilter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,pageprev:number,page:number) => {
  try {
    const response = await axios.get(`${baseUrl}stocklunashutang/alldatabayarhutang?optionlike=${optionlike}&wherelike=${wherelike}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`,{ headers });
    return response.data.databayarhutang;
  } catch (error) {
    console.error("Error hutang request:", error);
    throw error;
  }
};


export const getAllDataItem = async (optionlike:string,like:string,pembayaran:string,opsiquery:string,tanggaldari:string,tanggalsampai:string,opsi:string,pageprev:number,page:number) => {
  try {
    const response = await axios.get(`${baseUrl}stocklunashutang/alldataitem?optionlike=${optionlike}&like=${like}&pembayaran=${pembayaran}&opsiquery=${opsiquery}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&opsi=${opsi}&pageprev=${pageprev}&page=${page}`,{ headers });
    return response.data.datalunashutang;
  } catch (error) {
    console.error("Error hutang request:", error);
    throw error;
  }
};


export const getAllDataById= async (nobukti:string) => {
  try {
    const response = await axios.get(`${baseUrl}stocklunashutang/alldatabyid?noBukti=${nobukti}`,{ headers });
    return response.data.datalunashutang;
  } catch (error) {
    console.error("Error hutang request:", error);
    throw error;
  }
};


export const PrntAllDataItemById = async (nobukti:string) => {
  //console.log(`${baseUrl}stocklunashutang/printlaporanbyid?noBukti=${nobukti}`);
  return `${baseUrl}stocklunashutang/printlaporanbyid?noBukti=${nobukti}`;
};



export const PrntAllDataItem = async (optionlike:string,like:string,pembayaran:string,opsiquery:string,tanggaldari:string,tanggalsampai:string,opsi:string,pageprev:number,page:number) => {
  //console.log(`${baseUrl}stocklunashutang/printalldata?optionlike=${optionlike}&like=${like}&pembayaran=${pembayaran}&opsiquery=${opsiquery}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&opsi=${opsi}&pageprev=${pageprev}&page=${page}`);
  return `${baseUrl}stocklunashutang/printalldata?optionlike=${optionlike}&like=${like}&pembayaran=${pembayaran}&opsiquery=${opsiquery}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&opsi=${opsi}&pageprev=${pageprev}&page=${page}`;
};

export const PrntAllDataPembayaranItem = async (optionlike:string,wherelike:string,optionfilter:string,tanggaldari:string,tanggalsampai:string,bulan:string,tahun:string,pageprev:number,page:number) => {
  console.log(`${baseUrl}stocklunashutang/printlaporanbayarhutang?optionlike=${optionlike}&wherelike=${wherelike}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`);
  return `${baseUrl}stocklunashutang/printlaporanbayarhutang?optionlike=${optionlike}&wherelike=${wherelike}&optionfilter=${optionfilter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}&pageprev=${pageprev}&page=${page}`;
};