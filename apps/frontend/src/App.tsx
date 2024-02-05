import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import WelcomeStart from "./routes/WelcomePage.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import AdminMapPage from "./routes/admin-routes/AdminMapPage.tsx";
import ServiceRequestPage from "./routes/ServiceRequestPage.tsx";
import RequestList from "./routes/admin-routes/RequestList.tsx";
import NodeEdgeTablePage from "./routes/admin-routes/NodeEdgeTablePage.tsx";
import GuestMap from "./routes/guest-routes/GuestMap.tsx";
import NewMapPage from "./routes/NewMapPage.tsx";
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
          path: "/LoginPage",
          element: <LoginPage />,
        },
        {
          path: "/AdminMapPage",
          element: <AdminMapPage />,
        },
        {
          path: "/ServiceRequestPage",
          element: <ServiceRequestPage />,
        },
        {
          path: "/NodeEdgeTablePage",
          element: <NodeEdgeTablePage />,
        },
        {
          path: "/GuestMap",
          element: <GuestMap />,
        },
        {
          path: "/RequestList",
          element: <RequestList />,
        },
          {
              path:"NewMapPage",
              element: <NewMapPage/>,
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
