import { createContext, useEffect, useState } from "react";

const CONT = createContext(null);
function Context({ children }) {
  const functions = {
    formatCurrencyKE,
    errorProfileImg,
  };

  function errorProfileImg(e) {
    e.target.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }

  function formatCurrencyKE(number) {
    if (isNaN(number)) {
      return "Invalid Input";
    }
    const amount = parseFloat(number);
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    });

    return formatter.format(amount);
  }

  return <CONT.Provider value={functions}>{children}</CONT.Provider>;
}
export { Context, CONT };
