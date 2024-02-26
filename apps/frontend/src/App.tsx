import React from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import ProtectedAdminMap from "./components/protected-pages/ProtectedAdminMap.tsx";
//import ProtectedServiceRequest from "./components/protected-pages/ProtectedServiceRequest.tsx";
import ServiceRequestPage from "./routes/ServiceRequestPage.tsx";
import ProtectedRequestList from "./components/protected-pages/ProtectedRequestList.tsx";
import ProtectedNodeEdgeTable from "./components/protected-pages/ProtectedNodeEdgeTable.tsx";
import AboutPage from './components/AboutPage.tsx';
import ProfilePage from "./components/ProfilePage.tsx";
//import GuestMap from "./routes/guest-routes/GuestMap.tsx";
import ProtectedEmployeeTable from "./components/protected-pages/ProtectedEmployeeTable.tsx";
import TailwindMapPage from "./routes/TailwindMapPage.tsx";
import TestServiceReqPage from "./routes/TestServiceReqPage.tsx";
import ProtectedRegisterPage from "./components/protected-pages/ProtectedRegisterPage.tsx";
import PackageCredits from "./routes/PackageCredits.tsx";

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
                    path:"/ServiceRequest",
                    element:<ServiceRequestPage/>,
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
                    path: "/Registerpage",
                    element: <ProtectedRegisterPage/>,
                },
                {
                    path: "/AboutPage",
                    element: <AboutPage/>,
                },
                {
                    path: "/Credits",
                    element: <PackageCredits/>,
                },

                {
                    path: "/ProfilePage",
                    element: <ProfilePage/>,
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
