import React, { useContext, useState, useRef, useEffect } from "react";
import "../../Styles/publick/nav.css";
import { NavLink } from "react-router-dom";
import { CONT } from "../../context/AppContext";
import logo from "../../assets/link-logo.png";
import { baseUrl } from "../../../baseUrl";
import { useMutation } from "react-query";
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
  ];

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
      const response = await axios.post(`${baseUrl}/users/login/`, data);
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
          <div className="log-form-head">Create your LinX account</div>
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
              name="password1"
              placeholder="******"
              minLength={6}
              required
            />
          </div>
          <div className="log-form-imp">
            <span>Repeat password</span>
            <input
              type="password"
              name="password2"
              placeholder="******"
              minLength={6}
              required
            />
          </div>
          <span>Remember me</span>
          <input type="checkbox" />
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
              "Sign up"
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
              password1: formData.get("password1"),
              password2: formData.get("password1"),
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
              name="password1"
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
              "Sign up"
            )}
          </button>
        </form>
      </div>
    );
  };

  return (
    <nav>
      <ToastContainer autoClose={5000} hideProgressBar theme={"light"} />
      {signUpOpen && <SignUpForm />}
      {signInOpen && <SignInForm />}
      <div className="nav-top">
        <div className="nav-logo">
          <img src={logo} alt="" />
        </div>
        <div
          className="nav-categoriy-cnt nav-c1"
          onScroll={handleScroll}
          ref={navCategoryRef}
        >
          <ul className="nav-categories">
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
        <ul className="nav-center">
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
                  Sign up
                </button>{" "}
                <button onClick={() => setSignInOpen(true)}>Sign in</button>
              </div>
            )}
          </li>
        </ul>

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
          className="nav-categoriy-cnt nav-c2"
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
