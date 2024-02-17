import React from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import ProtectedAdminMap from "./components/protected-pages/ProtectedAdminMap.tsx";
import ProtectedServiceRequest from "./components/protected-pages/ProtectedServiceRequest.tsx";
import ProtectedRequestList from "./components/protected-pages/ProtectedRequestList.tsx";
import ProtectedNodeEdgeTable from "./components/protected-pages/ProtectedNodeEdgeTable.tsx";
import AboutPage from './components/AboutPage.tsx';
//import GuestMap from "./routes/guest-routes/GuestMap.tsx";
import ProtectedEmployeeTable from "./components/protected-pages/ProtectedEmployeeTable.tsx";

import TailwindMapPage from "./routes/TailwindMapPage.tsx";
import TestServiceReqPage from "./routes/TestServiceReqPage.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <div/>,
            element: <Root/>,
            children: [
                {
                    path: "",
                    element: <TailwindMapPage/>,
                },
                {
                    path: "/AdminMapPage",
                    element: <ProtectedAdminMap/>,
                },
                {
                    path: "/ProtectedServiceRequest",
                    element: <ProtectedServiceRequest/>,
                },
                {
                    path:"/ServiceRequest",
                    element:<ProtectedServiceRequest/>,
                },
                {
                    path: "/NodeEdgeTable",
                    element: <ProtectedNodeEdgeTable/>,
                },
                {
                    path: "/ProtectedRequestList",
                    element: <ProtectedRequestList/>,
                },
                {
                    path: "/RequestList",
                    element: <ProtectedRequestList/>,
                },
                {
                    path: "/GuestMap",
                    element: <TailwindMapPage/>,
                },
                {
                    path:"/EmployeeTable",
                    element: <ProtectedEmployeeTable/>,
                },
                {
                    path: "/TailwindMapPage",
                    element: <TailwindMapPage/>,
                },
                {
                    path: "/TestServiceReqPage",
                        element: <TestServiceReqPage/>,
                },
                {
                    path: "/AboutPage",
                    element: <AboutPage/>,
                },
            ],
        },
    ]);

    return <RouterProvider router={router}/>;

    function Root() {
        return <Outlet/>;
    }
}

export default App;
