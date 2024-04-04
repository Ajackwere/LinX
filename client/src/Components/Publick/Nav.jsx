import React, { useContext } from "react";
import "../../Styles/publick/nav.css";
import { NavLink } from "react-router-dom";
import { CONT } from "../../context/AppContext";

function Nav() {
  const vl = useContext(CONT);
  return (
    <nav>
      <h1>Links</h1>
      <ul>
        <NavLink to="/">
          <li>
            <span className="material-symbols-outlined">home</span>
            <div className="active-line"></div>
          </li>
        </NavLink>
        <li>
          <span className="material-symbols-outlined">list_alt</span>
          <div className="active-line"></div>
        </li>
        <li>
          <span className="material-symbols-outlined">edit_square</span>
          <div className="active-line"></div>
        </li>
        <li>
          <span className="material-symbols-outlined">notifications</span>
          <div className="active-line"></div>
        </li>
        <li>
          <div className="nav-search">
            <span className="material-symbols-outlined">search</span>
            <input type="search" placeholder="Search something" />
          </div>
        </li>
      </ul>
      <div className="nav-profile">
        <img src="" alt="" onError={vl.errorProfileImg} />
      </div>
    </nav>
  );
}

export default Nav;
