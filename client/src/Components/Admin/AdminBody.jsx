import React from "react";
import "../../Styles/Account/adminbody.css";
import { Outlet } from "react-router";

function AdminBody({ Outlet }) {
  return (
    <div className="account-body">
      <div className="admin-body-nav">
        <div className="amn-sec">
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
