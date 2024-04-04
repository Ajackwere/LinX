import React from "react";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import StateCheker from "./StateCheker";
import MainApp from "./Publick/MainApp";

function Main() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<StateCheker />}>
        <Route path="/" element={<MainApp />}></Route>
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default Main;
