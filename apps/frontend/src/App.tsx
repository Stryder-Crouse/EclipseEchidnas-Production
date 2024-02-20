import React from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import ProtectedAdminMap from "./components/protected-pages/ProtectedAdminMap.tsx";
import ProtectedServiceRequest from "./components/protected-pages/ProtectedServiceRequest.tsx";
import ProtectedRequestList from "./components/protected-pages/ProtectedRequestList.tsx";
import ProtectedNodeEdgeTable from "./components/protected-pages/ProtectedNodeEdgeTable.tsx";
//import GuestMap from "./routes/guest-routes/GuestMap.tsx";
import ProtectedEmployeeTable from "./components/protected-pages/ProtectedEmployeeTable.tsx";

import TailwindMapPage from "./routes/TailwindMapPage.tsx";
import TestServiceReqPage from "./routes/TestServiceReqPage.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import RegisterPage from "./routes/RegisterPage.tsx";
//import ServiceRequestPage from "./routes/ServiceRequestPage.tsx";
//import NodeEdgeTablePage from "./routes/admin-routes/NodeEdgeTablePage.tsx";
//import RequestList from "./routes/admin-routes/RequestList.tsx";
//import EmployeeTable from "./routes/admin-routes/EmployeeTable.tsx";


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
                    element: <ProtectedAdminMap/>, //todo FNFN switch back to protected when that works (same for all bellow) and uncomment the imports up top
                },
                {
                    path: "/ProtectedServiceRequest",
                    element: <ProtectedServiceRequest/>, //Here
                },
                {
                    path:"/ServiceRequest",
                    element:<ProtectedServiceRequest/>, //Here
                },
                {
                    path: "/NodeEdgeTable",
                    element: <ProtectedNodeEdgeTable/>,//Here
                },
                {
                    path: "/ProtectedRequestList",
                    element: <ProtectedRequestList/>,
                },
                {
                    path: "/RequestList",
                    element: <ProtectedRequestList/>, //Here
                },
                {
                    path: "/GuestMap",
                    element: <TailwindMapPage/>,
                },
                {
                    path:"/EmployeeTable",
                    element: <ProtectedEmployeeTable/>, //Here
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
                    path: "/LoginPage",
                    element: <LoginPage/>,
                },
                {
                    path: "/RegisterPage",
                    element: <RegisterPage/>,
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
