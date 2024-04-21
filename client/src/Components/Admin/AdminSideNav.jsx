import React from "react";
import "../../Styles/Account/adminsidenav.css";
import logo from "../../assets/link-logo.png";
import { NavLink } from "react-router-dom";

function AdminSideNav() {
  return (
    <aside className="side-nav">
      <div className="side-nav-logo">
        <img src={logo} alt="" />
      </div>
      <ul className="aside-navlinks">
        <NavLink to="/admin">
          <li>
            <span className="material-symbols-outlined">dashboard</span>{" "}
            Dashboard
          </li>
        </NavLink>
        <li>
          <span className="material-symbols-outlined">post_add</span> Add post
        </li>
      </ul>
    </aside>
  );
}

export default AdminSideNav;
