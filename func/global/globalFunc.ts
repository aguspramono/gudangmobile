export const DateFormat = (tanggal, format) => {
  // pastikan tanggal berupa Date object
  const dateObj = (tanggal instanceof Date) ? tanggal : new Date(tanggal);

  if (isNaN(dateObj.getTime())) return ""; // handle invalid date

  if (format === "yyyy-mm-dd") {
    return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
  } else if (format === "dd/mm/yyyy") {
    return `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`;
  }
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
};
