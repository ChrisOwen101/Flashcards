import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Login from "./Login";
import AddFlashcard from "./AddFlashcard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/addcard",
    element: <AddFlashcard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
