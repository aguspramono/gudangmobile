export const DateFormat =  (tanggal,format) => {
    if(format==="yyyy-mm-dd"){
        return `${tanggal.getFullYear()}-${(tanggal.getMonth()+1).toString().padStart(2, '0')}-${tanggal.getDate().toString().padStart(2, '0')}`;
    }else if(format==="dd/mm/yyyy"){
        return `${tanggal.getDate().toString().padStart(2, '0')}/${(tanggal.getMonth()+1).toString().padStart(2, '0')}/${tanggal.getFullYear()}`;
    }

};
