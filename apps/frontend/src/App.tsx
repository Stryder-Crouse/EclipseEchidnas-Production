import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import MapStart from "./routes/MapPage.tsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <Root />,
      children: [
        {
          path: "",
          element: <MapStart />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
  function Root() {
    return <Outlet />;
  }
}

export default App;
