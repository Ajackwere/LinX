import React from "react";
import AdminSideNav from "./AdminSideNav";
import AdminBody from "./AdminBody";
import "../../Styles/Account/account-cnt.css";
import { Outlet } from "react-router";

function AdminCnt() {
  return (
    <div className="account-cnt">
      <AdminSideNav />

      <AdminBody Outlet={Outlet} />
    </div>
  );
}

export default AdminCnt;
