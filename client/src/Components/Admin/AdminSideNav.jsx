import React, { useContext, useState } from "react";
import "../../Styles/Account/adminsidenav.css";
import logo from "../../assets/link-logo.png";
import { NavLink } from "react-router-dom";
import { CONT } from "../../context/AppContext";

function AdminSideNav() {
  const vl = useContext(CONT);
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
        style={{ transition: "0.5s ease" }}
      >
        <aside className="side-nav">
          <div className="side-nav-logo">
            <img src={logo} alt="" />
          </div>
          <ul className="aside-navlinks">
            <NavLink
              to="/admin/dashboard"
              onClick={() =>
                vl.setPath([{ title: "Dashboard", path: "/admin/dashboard" }])
              }
            >
              <li>
                <span className="material-symbols-outlined">dashboard</span>{" "}
                Dashboard
              </li>
            </NavLink>
            <NavLink
              to="/admin/posts"
              onClick={() =>
                vl.setPath([{ title: "Posts", path: "/admin/posts" }])
              }
            >
              <li>
                <span className="material-symbols-outlined">post</span> Posts
              </li>
            </NavLink>
            <NavLink to="/admin/ADs">
              <li>
                <span className="material-symbols-outlined">ad</span> AD's
              </li>
            </NavLink>
            <NavLink to="/admin/authors">
              <li>
                <span className="material-symbols-outlined">
                  assignment_ind
                </span>{" "}
                Authors
              </li>
            </NavLink>
          </ul>
        </aside>
      </div>
    </>
  );
}

export default AdminSideNav;
