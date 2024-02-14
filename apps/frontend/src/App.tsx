import React from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import ProtectedAdminMap from "./components/protected-pages/ProtectedAdminMap.tsx";
import ServiceRequest from "./routes/ServiceRequestPage.tsx";
import RequestList from "./routes/admin-routes/RequestList.tsx";
import ProtectedNodeEdgeTable from "./components/protected-pages/ProtectedNodeEdgeTable.tsx";
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
                    path: "/ServiceRequest",
                    element: <ServiceRequest/>,
                },
                {
                    path: "/NodeEdgeTable",
                    element: <ProtectedNodeEdgeTable/>,
                },
                {
                    path: "/RequestList",
                    element: <RequestList/>,
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
            ],
        },
    ]);

    return <RouterProvider router={router}/>;

    function Root() {
        return <Outlet/>;
    }
}

export default App;
