import React, { useState } from "react";
import "../../Styles/Account/adminsidenav.css";
import logo from "../../assets/link-logo.png";
import { NavLink } from "react-router-dom";
import { CONT } from "../../context/AppContext";

function AdminSideNav() {
  const vl = useState(CONT);
  console.log(vl);
  return (
    <>
      {/*  <aside className="side-nav">
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
    </aside> */}

      <div
        className={
          vl.menuOpen ? "admin-sidenav-cnt menu-open" : "admin-sidenav-cnt"
        }
      >
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
              <span className="material-symbols-outlined">post_add</span> Add
              post
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}

export default AdminSideNav;
