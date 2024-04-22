import { createContext, useEffect, useState } from "react";

const CONT = createContext(null);
function Context({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const functions = {
    formatCurrencyKE,
    menuOpen,
    setMenuOpen,
  };

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
