import React from "react";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import StateCheker from "./StateCheker";
import MainApp from "./Publick/MainApp";
import AdminCnt from "./Admin/AdminCnt";
import DashBoard from "./Admin/DashBoard";
import Posts from "./Admin/Posts";
import ADs from "./Admin/ADs";
import Authors from "./Admin/Authors";
import NewPost from "./Admin/NewPost";
import NewAd from "./Admin/NewAd";
import "react-toastify/dist/ReactToastify.css";

function Main() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<StateCheker />}>
        <Route path="/" element={<MainApp />}></Route>
        <Route path="/ct/:query" element={<MainApp />}></Route>
        <Route path="/admin" element={<AdminCnt />}>
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/new_post" element={<NewPost />} />
          <Route path="ADs" element={<ADs />} />
          <Route path="ADs/new_ad" element={<NewAd />} />
          <Route path="authors" element={<Authors />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default Main;
