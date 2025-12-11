import { createBrowserRouter } from "react-router";
import HomePage from "../pages/Home/HomePage";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import ContestDetails from "../components/ContestDetails/ContestDetails";
import AllContests from "../pages/All-Contests/AllContests";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import AboutUs from "../pages/aboutUs/aboutUs";

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
            },
            {
                path: '/contest/details/:id',
                Component: ContestDetails,
            },
            {
                path: '/all-contests',
                Component: AllContests,
            },
            {
                path: '/leaderboard',
                Component: Leaderboard,
            },
            {
                path: '/about',
                Component: AboutUs
            }
        ]
    },
    {
        path: '*',
        Component: ErrorPage
    }
]);

export default router;