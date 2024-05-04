import React from "react";
import Nav from "./Nav";
import Blogs from "./Blogs";
import "../../Styles/publick/blogs.css";
import Footer from "./Footer";

function MainApp() {
  return (
    <>
      <Nav />
      <Blogs />
      <Footer />
    </>
  );
}

export default MainApp;
