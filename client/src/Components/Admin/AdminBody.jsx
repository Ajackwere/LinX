import React, { useContext, useEffect, useState } from "react";
import "../../Styles/Account/adminbody.css";
import { CONT } from "../../context/AppContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function AdminBody({ Outlet }) {
  const vl = useContext(CONT);
  const navTo = useNavigate(null);
  useEffect(() => {
    /* if (!vl.serIsLoged) {
      navTo("/admin/login");
    } */
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
          <span className="material-symbols-outlined">home</span>
          {vl.path.map((path, i) => (
            <Link
              to={path.path}
              onClick={() => vl.setPath(vl.path.slice(0, i + 1))}
            >
              / {path.title}
            </Link>
          ))}
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
