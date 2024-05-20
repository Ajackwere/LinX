import React, { useContext, useState, useRef, useEffect } from "react";
import "../../Styles/publick/nav.css";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { CONT } from "../../context/AppContext";
import logo from "../../assets/link-logo.png";
import { baseUrl } from "../../../baseUrl";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Loader";

function Nav() {
  const vl = useContext(CONT);
  const [activeCt, setActiveCt] = useState("All");
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const navCategoryRef = useRef(null);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const navTo = useNavigate(null);
  const searchParams = new URLSearchParams(window.location.search);
  const categoryId = searchParams.get("id");
  const { query } = useParams();
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileSearch, setMobileSearch] = useState(false);

  useEffect(() => {
    setActiveCategory(categoryId);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSignUpOpen(true);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

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

  const categories = useQuery("categories", async () => {
    const response = await axios.get(`${baseUrl}/categories/`);
    return response.data;
  });

  const registerUser = useMutation(
    async (data) => {
      const response = await axios.post(`${baseUrl}/users/register/`, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast("Sign up successful");
        vl.setUserIsLoged(true);
        setSignUpOpen(false);
      },
      onError: (error) => {
        toast(`Failed to add user, ${error.response.data?.message}`);
      },
    }
  );

  const loginUser = useMutation(
    async (data) => {
      const response = await axios.post(`${baseUrl}/userlogin/`, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast("Sign up successful");
        vl.setUserIsLoged(true);
        setSignUpOpen(false);
      },
      onError: (error) => {
        toast(`Failed to login, ${error.response.data?.error_message}`);
      },
    }
  );

  const SignUpForm = () => {
    return (
      <div className="log-form-cnt">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (formData.get("password1") === formData.get("password2")) {
              registerUser.mutate({
                username: formData.get("email"),
                password1: formData.get("password1"),
                password2: formData.get("password2"),
              });
            } else {
              toast("Password does not match!");
            }
          }}
        >
          <span
            className="material-symbols-outlined close-log-form"
            onClick={() => setSignUpOpen(false)}
          >
            close
          </span>
          <div className="log-form-head">Subscribe to LinX</div>
          <div className="log-form-imp">
            <span>Email</span>
            <input
              type="text"
              name="email"
              placeholder="name@company.com"
              required
            />
          </div>

          <button
            className="log-submit-btn"
            style={
              registerUser.isLoading
                ? { opacity: "0.5", pointerEvents: "none" }
                : null
            }
          >
            {registerUser.isLoading ? (
              <div
                className="center-loader"
                style={{ position: "absolute", top: "-5px", width: "100%" }}
              >
                <Loader />
              </div>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    );
  };

  const SignInForm = () => {
    return (
      <div className="log-form-cnt">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            loginUser.mutate({
              username: formData.get("email"),
              password: formData.get("password"),
            });
          }}
        >
          <span
            className="material-symbols-outlined close-log-form"
            onClick={() => setSignInOpen(false)}
          >
            close
          </span>
          <div className="log-form-head">Sign in to your account</div>
          <div className="log-form-imp">
            <span>Email</span>
            <input
              type="text"
              name="email"
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="log-form-imp">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="******"
              minLength={6}
              required
            />
          </div>

          <br />
          <button
            className="log-submit-btn"
            style={
              loginUser.isLoading
                ? { opacity: "0.5", pointerEvents: "none" }
                : null
            }
          >
            {loginUser.isLoading ? (
              <div
                className="center-loader"
                style={{ position: "absolute", top: "-5px", width: "100%" }}
              >
                <Loader />
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    );
  };
  const searchParam = new URLSearchParams(window.location.search);
  const urlQuery = searchParam.get("q");
  const Search = () => {
    const [searching, setSearching] = useState(false);
    return (
      <form
        className="nav-search"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          navTo(`/search/d?q=${formData.get("query")}`);
        }}
      >
        <button>
          <span className="material-symbols-outlined">search</span>
        </button>

        <input
          type="text"
          name="query"
          className="nav-search-input"
          {...(urlQuery && !searching ? { value: urlQuery } : null)}
          placeholder="Search something here..."
          onClick={() => setSearching(true)}
          onChange={() => {}}
        />
        <span
          className="material-symbols-outlined close-search"
          onClick={() => setMobileSearch(false)}
        >
          close
        </span>
      </form>
    );
  };
  return (
    <nav>
      <ToastContainer autoClose={5000} hideProgressBar theme={"light"} />
      {signUpOpen && <SignUpForm />}
      {signInOpen && <SignInForm />}
      <div className="nav-top">
        <div className="nav-logo">
          <img
            src={logo}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => navTo("/")}
          />
        </div>
        <div
          className="nav-categoriy-cnt nav-c1"
          onScroll={handleScroll}
          ref={navCategoryRef}
        >
          <ul className="nav-categories">
            {Array.isArray(categories.data) &&
              categories.data.map((category) => (
                <Link to={`/ct/${category.name}?id=${category.id}`}>
                  <li
                    key={category.name}
                    style={
                      activeCategory === `${category.id}`
                        ? { backgroundColor: "#d5ad18" }
                        : null
                    }
                  >
                    {category.name}
                  </li>
                </Link>
              ))}
          </ul>
        </div>
        <ul
          className="nav-center"
          style={{ gap: "0.8rem", alignItems: "center" }}
        >
          <li className="nav-search-li">
            <Search />
          </li>
          <div className="nav-search2">
            <span
              className="material-symbols-outlined"
              onClick={() => setMobileSearch(true)}
            >
              search
            </span>
          </div>
          <li>
            {vl.userIsLoged ? (
              <div className="nav-profile">
                <img src="" onError={vl.errorProfileImg} alt="" />
              </div>
            ) : (
              <div className="log-btns">
                <button
                  className="log-singup"
                  onClick={() => setSignUpOpen(true)}
                >
                  Subscribe
                </button>{" "}
                {/* <span onClick={() => setSignInOpen(true)}>Log in</span> */}
              </div>
            )}
          </li>
        </ul>
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
          className="nav-categoriy-cnt nav-c2"
          onScroll={handleScroll}
          ref={navCategoryRef}
        >
          <ul className="nav-categories">
            {Array.isArray(categories.data) &&
              categories.data.map((category) => (
                <Link to={`/ct/${category.name}?id=${category.id}`}>
                  <li
                    key={category.name}
                    style={
                      activeCategory === `${category.id}`
                        ? { backgroundColor: "#d5ad18" }
                        : null
                    }
                  >
                    {category.name}
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      </div>
      {mobileSearch && <Search />}
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
