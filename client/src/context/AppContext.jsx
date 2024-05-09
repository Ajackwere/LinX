import { createContext, useEffect, useState } from "react";

const CONT = createContext(null);
function Context({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userIsLoged, setUserIsLoged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchCategory, setFetchCategory] = useState({
    key: "all",
    path: "/blogs",
  });
  const [path, setPath] = useState([
    { title: "Dashboard", path: "/admin/dashboard" },
  ]);
  const functions = {
    formatCurrencyKE,
    formatTime,
    menuOpen,
    setMenuOpen,
    path,
    setPath,
    userIsLoged,
    setUserIsLoged,
    fetchCategory,
    setFetchCategory,
    userData,
    setUserData,
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

  function formatTime(timeString) {
    try {
      // Parse the time string as a Date object
      const dateObj = new Date(timeString);

      // Format the date object to dd/mm/yyyy using the toLocaleDateString() method
      const formattedTime = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return formattedTime;
    } catch (error) {
      console.error("Error formatting time:", error);
      return null; // Or any default value you prefer for invalid timestamps
    }
  }

  return <CONT.Provider value={functions}>{children}</CONT.Provider>;
}
export { Context, CONT };
