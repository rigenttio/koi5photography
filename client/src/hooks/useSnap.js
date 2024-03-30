import React, { useEffect, useState } from "react";
import { env } from "../lib/env";

export const useSnap = () => {
  const [snap, setSnap] = useState(null);

  useEffect(() => {
    const midtransScriptUrl = env("VITE_MIDTRANS_BASE_URL") + "/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = env("VITE_MIDTRANS_CLIENT_KEY");
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.onload = () => {
      setSnap(window.snap);
    };

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleSnapPay = (token_snap, action) => {
    if (snap) {
      snap.pay(token_snap, {
        onSuccess: function (result) {
          action.onSuccess(result);
        },
        onPending: function (result) {
          action.onPending(result);
        },
        onError: function (result) {
          action.onError(result);
        },
        onClose: function () {
          action.onClose();
        },
      });
    }
  };

  return { handleSnapPay };
};
