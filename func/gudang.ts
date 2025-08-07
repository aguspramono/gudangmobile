import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
    "Content-Type": "multipart/form-data",
};


export const getAllDataGudang = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}gudang/alldata`, {
            headers: headers
        }
        );

        return response.data.datagudang;
    } catch (error) {
        console.error("Error keluar request:", error);
        throw error;
    }
};
