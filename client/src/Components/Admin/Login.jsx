import React, { useContext } from "react";
import { useMutation } from "react-query";
import { baseUrl } from "../../../baseUrl";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import Loader from "../Loader";
import { CONT } from "../../context/AppContext";

function Login() {
  const vl = useContext(CONT);
  const navTo = useNavigate(null);
  const loginUser = useMutation(
    async (data) => {
      const response = await axios.post(`${baseUrl}/userlogin/`, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast("Sign up successful");
        vl.setUserIsLoged(true);
        navTo("/admin/dashboard");
      },
      onError: (error) => {
        toast(`Failed to login, ${error.response.data?.error_message}`);
      },
    }
  );

  return (
    <div className="log-form-cnt" style={{ backgroundColor: "white" }}>
      <ToastContainer autoClose={5000} hideProgressBar theme={"light"} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          loginUser.mutate({
            username: formData.get("username"),
            password: formData.get("password"),
          });
        }}
      >
        <div className="log-form-head">Log in</div>
        <div className="log-form-imp">
          <span>Username</span>
          <input type="text" name="username" required />
        </div>
        <div className="log-form-imp">
          <span>Password</span>
          <input type="password" name="password" minLength={6} required />
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
            "Log in"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
