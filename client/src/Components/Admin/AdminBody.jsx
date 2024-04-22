import React, { useContext, useEffect } from "react";
import "../../Styles/Account/adminbody.css";
import { CONT } from "../../context/AppContext";

function AdminBody({ Outlet }) {
  const vl = useContext(CONT);
  useEffect(() => {
    function menuToggole(e) {
      if (
        !e.target.closest(".admin-sidenav") &&
        !e.target.closest(".menu-btn")
      ) {
        vl.setMenuOpen(false);
      }
    }
    window.addEventListener("click", menuToggole);
    return () => {
      window.removeEventListener("click", menuToggole);
    };
  }, []);
  return (
    <div className="account-body">
      <div className="admin-body-nav">
        <div className="amn-sec">
          <span
            className="material-symbols-outlined adm-nav-menu-btn menu-btn"
            onClick={() => vl.setMenuOpen(true)}
          >
            menu
          </span>
          <span className="material-symbols-outlined">home</span>/ Dashboard
        </div>
        <div className="amn-sec">
          Welcome
          <span className="material-symbols-outlined">account_circle</span>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminBody;
