export const FormatDate = ({ value, showTime = true }) => {
  const date = new Date(value);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(showTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
    hour12: false,
    // timeZone: "Asia/Jakarta",
  };
  const formattedDate = date.toLocaleString("id-ID", options);
  return formattedDate;
};
