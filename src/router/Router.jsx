import { createBrowserRouter } from "react-router";
import HomePage from "../pages/Home/HomePage";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";

const router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayout,
        children: [
            {
                index: true,
                Component: HomePage
            },
            {
                path: '/register',
                Component: Register
            },
            {
                path: '/login',
                Component: Login,
            }
        ]
    },
]);

export default router;