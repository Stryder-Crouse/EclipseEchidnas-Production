import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import WelcomeStart from "./routes/WelcomePage.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import AdminMapPage from "./routes/AdminMapPage.tsx";
import NodeFileImport from "./routes/ImportNodeFile.tsx";
import EdgeFileImport from "./routes/ImportEdgeFile.tsx";
import MedicineRequest from "./routes/MedicineRequest.tsx";
import RequestList from "./routes/RequestList.tsx";
import FileTable from "./routes/FileTable.tsx";
import GuestMap from "./routes/GuestMap.tsx";
//import RequireAuth from "./components/RequireAuth.tsx";

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
          path: "/ImportNodeFile",
          element: <NodeFileImport />,
        },
        {
          path: "/ImportEdgeFile",
          element: <EdgeFileImport />,
        },
        {
          path: "/MedicineRequest",
          element: <MedicineRequest />,
        },
        {
          path: "/FileTable",
          element: <FileTable />,
        },
        {
          path: "/RequestList",
          element: <RequestList />,
        },
        {
          path: "/GuestMap",
          element: <GuestMap />,
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
