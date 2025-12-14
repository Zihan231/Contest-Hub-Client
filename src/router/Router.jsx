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
import ContactUs from "../pages/ContactUs/ContactUs";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import OverView from "../pages/OverView/OverView";
import CreateContest from "../pages/CreateContest/CreateContest";
import MyProfile from "../pages/MyProfile/MyProfile";
import ManageContests from "../pages/ManageContests/ManageContests";
import ManageUsers from "../pages/ManageUsers/ManageUsers";
import MyCreatedContests from "../pages/MyCreatedContests/MyCreatedContests";
import TaskSubmissions from "../pages/TaskSubmissions/TaskSubmissions";

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
                element: <PrivateRoute>
                    <ContestDetails></ContestDetails>
                </PrivateRoute>
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
            },
            {
                path: '/contact',
                Component: ContactUs
            },
            {
                path: '/privacy',
                Component: PrivacyPolicy
            }
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoute>
            <DashboardLayout />
        </PrivateRoute>,
        children: [
            {
                index: true,
                Component: OverView
            },
            {
                path: "creator/create",
                Component: CreateContest
            },
            {
                path: "profile",
                Component: MyProfile
            },
            {
                path: "manage/contests",
                Component: ManageContests
            },
            {
                path: "manage/users",
                Component: ManageUsers
            },
            {
                path: "creator/my-contests",
                Component: MyCreatedContests
            },
            {
                path: "creator/contest/task/:id",
                Component: TaskSubmissions
            }
        ]
    },
    {
        path: '*',
        Component: ErrorPage
    }
]);

export default router;