import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import Router from "./Router/Router.jsx";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={Router} />
);
