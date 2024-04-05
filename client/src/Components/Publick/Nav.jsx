import React, { useContext, useState } from "react";
import "../../Styles/publick/nav.css";
import { NavLink } from "react-router-dom";
import { CONT } from "../../context/AppContext";
import logo from "../../assets/link-logo.png";

function Nav() {
  const vl = useContext(CONT);
  const [activeCt, setActiveCt] = useState("All");
  const categories = [
    "All",
    "Sports",
    "Health & lifestyle",
    "Beauty & Skincare",
    "Business",
    "Technology",
    "Travel",
  ];
  return (
    <nav>
      <div className="nav-logo">
        <img src={logo} alt="" />
      </div>
      <ul>
        <NavLink to="/">
          <li>
            <span className="material-symbols-outlined">home</span>
            <div className="active-line"></div>
          </li>
        </NavLink>
        <li>
          <span className="material-symbols-outlined">bookmark</span>
          <div className="active-line"></div>
        </li>

        <li>
          <span className="material-symbols-outlined">notifications</span>
          <div className="active-line"></div>
        </li>
        <li>
          <div className="nav-categories">
            <div className="nav-active-category">
              <span>{activeCt}</span>{" "}
              <span className="material-symbols-outlined">expand_more</span>
            </div>
            <ul>
              {categories.map((category) =>
                category !== activeCt ? (
                  <li onClick={() => setActiveCt(category)}>{category}</li>
                ) : null
              )}
            </ul>
          </div>
        </li>
        <li>
          <div className="nav-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              className="nav-search-input"
              placeholder="Search something"
            />
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
