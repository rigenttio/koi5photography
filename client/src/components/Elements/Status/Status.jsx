import React from "react";

const Status = (props) => {
  const { status } = props;
  let bg = "";

  switch (status) {
    case "belum bayar":
      bg = "bg-yellow-300";
      break;
    case "dibayar":
      bg = "bg-green-500";
      break;
    case "diambil":
      bg = "bg-orange-400";
      break;
    case "selesai":
      bg = "bg-blue-500";
      break;
    case "dibatalkan":
    case "refund":
      bg = "bg-red-500";
      break;

    default:
      break;
  }
  return <span className={`py-1 px-3 min-w-28 whitespace-nowrap inline-block text-center rounded-3xl uppercase text-white text-xs ${bg}`}>{status}</span>;
};

export default Status;
