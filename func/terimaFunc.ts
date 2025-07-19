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