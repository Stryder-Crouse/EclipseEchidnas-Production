import React from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import WelcomeStart from "./routes/WelcomePage.tsx";
import ProtectedAdminMap from "./components/protected-pages/ProtectedAdminMap.tsx";
import ProtectedServiceRequest from "./components/protected-pages/ProtectedServiceRequest.tsx";
import ProtectedRequestList from "./components/protected-pages/ProtectedRequestList.tsx";
import ProtectedNodeEdgeTable from "./components/protected-pages/ProtectedNodeEdgeTable.tsx";
import GuestMap from "./routes/guest-routes/GuestMap.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <div/>,
            element: <Root/>,
            children: [
                {
                    path: "",
                    element: <WelcomeStart/>,
                },
                {
                    path: "/AdminMapPage",
                    element: <ProtectedAdminMap/>,
                },
                {
                    path: "/ServiceRequest",
                    element: <ProtectedServiceRequest/>,
                },
                {
                    path: "/NodeEdgeTable",
                    element: <ProtectedNodeEdgeTable/>,
                },
                {
                    path: "/RequestList",
                    element: <ProtectedRequestList/>,
                },
                {
                    path: "/GuestMap",
                    element: <GuestMap/>,
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
