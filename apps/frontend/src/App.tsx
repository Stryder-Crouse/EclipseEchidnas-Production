import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import WelcomeStart from "./routes/WelcomePage.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import MapPage from "./routes/MapPage.tsx";
import NodeFileImport from "./components/ImportNodeFile.tsx";
import EdgeFileImport from "./components/ImportEdgeFile.tsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <Root />,
      children: [
        {
          path: "",
          element: <WelcomeStart />,
        },
        {
          path: "/StaffLogin",
          element: <LoginPage />,
        },
        {
          path: "/MapPage",
          element: <MapPage />,
        },
        {
          path: "/ImportNodeFile",
          element: <NodeFileImport />,
        },
        {
          path: "/ImportEdgeFile",
          element: <EdgeFileImport />,
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
