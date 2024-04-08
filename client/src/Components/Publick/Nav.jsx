import React, { useContext, useState, useRef, useEffect } from "react";
import "../../Styles/publick/nav.css";
import { NavLink } from "react-router-dom";
import { CONT } from "../../context/AppContext";
import logo from "../../assets/link-logo.png";

function Nav() {
  const vl = useContext(CONT);
  const [activeCt, setActiveCt] = useState("All");
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const navCategoryRef = useRef(null);

  useEffect(() => {
    const container = navCategoryRef.current;
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  }, []);

  const handleScroll = () => {
    const container = navCategoryRef.current;
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const categories = [
    "All",
    "Sports",
    "Health & lifestyle",
    "Beauty & Skincare",
    "Business",
    "Technology",
    "Travel",
    "Health & lifestyle",
    "Beauty & Skincare",
    "Business",
    "Technology",
    "Travel",
  ];

  return (
    <nav>
      <div className="nav-top">
        <div className="nav-logo">
          <img src={logo} alt="" />
        </div>
        <ul className="nav-center">
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
          <li className="nav-search-li">
            <div className="nav-search">
              <span className="material-symbols-outlined">search</span>
              <input
                type="search"
                className="nav-search-input"
                placeholder="Search something"
              />
            </div>
          </li>
          <li>
            <div className="nav-profile nav-profile2">
              <img src="" alt="" onError={vl.errorProfileImg} />
            </div>
          </li>
        </ul>
        <div className="nav-profile">
          <img src="" alt="" onError={vl.errorProfileImg} />
        </div>

        <div className="nav-search2">
          <span className="material-symbols-outlined">search</span>
        </div>
      </div>
      <div className="nav-bottom">
        {showLeftButton && (
          <div className="n-c-slider ncs-left" onClick={scrollLeft}>
            <div className="n-c-slider-btn">
              <span className="material-symbols-outlined">chevron_left</span>
            </div>
          </div>
        )}
        {showRightButton && (
          <div className="n-c-slider ncs-right" onClick={scrollRight}>
            <div className="n-c-slider-btn">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </div>
        )}
        <div
          className="nav-categoriy-cnt"
          onScroll={handleScroll}
          ref={navCategoryRef}
        >
          <ul className="nav-categories">
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );

  function scrollLeft() {
    const container = navCategoryRef.current;
    container.scrollLeft -= 100; // Adjust the scroll amount as needed
  }

  function scrollRight() {
    const container = navCategoryRef.current;
    container.scrollLeft += 100; // Adjust the scroll amount as needed
  }
}

export default Nav;
