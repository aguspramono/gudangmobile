import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getAllClosingOrderRequest = async (wherelike: string, pageprev: number, page: number, option: string, filter: string, tanggaldari: string, tanggalsampai: string, bulan: string, tahun: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockclosing?like=${wherelike}&pageprev=${pageprev}&page=${page}&option=${option}&filter=${filter}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&bulan=${bulan}&tahun=${tahun}`, { headers: headers }
        );

        return response.data.dataClosingOrderBarang;
    } catch (error) {
        console.error("Error close order request:", error);
        throw error;
    }
};


export const getAllClosingOrderRequestByid = async (wherelike: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockclosing/detail?id=${wherelike}`, {
            headers: headers
        }
        );

        return response.data.dataStockClosing;
    } catch (error) {
        console.error("Error close order request:", error);
        throw error;
    }
};

export const getAllClosingOrderDetailRequestByid = async (wherelike: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}stockclosing/stockclosingdetail?id=${wherelike}`, {
            headers: headers
        }
        );

        return response.data.dataStockClosingDetail;
    } catch (error) {
        console.error("Error close order request:", error);
        throw error;
    }
};


