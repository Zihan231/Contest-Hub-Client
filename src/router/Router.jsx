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
import MyParticipatedContests from "../pages/MyParticipatedContests/MyParticipatedContests";
import TestAnimation from "../Test/TestAnimation/TestAnimation";
import MyWinningContests from "../pages/MyWinningContests/MyWinningContests";
import AdminRoute from "./adminRoute/adminRoute";
import CreatorRoute from "./CreatorRoute/CreatorRoute";
import UserRoute from "./UserRoute/UserRoute";
import PaymentSuccess from "../components/PaymentSuccess/PaymentSuccess";
import PaymentFail from "../components/PaymentFail/PaymentFail";

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
                element: <CreatorRoute>
                    <CreateContest></CreateContest>
                </CreatorRoute>
            },
            {
                path: "profile",
                Component: MyProfile
            },
            {
                path: "manage/contests",
                element: <AdminRoute>
                    <ManageContests></ManageContests>
                </AdminRoute>
            },
            {
                path: "manage/users",
                element: <AdminRoute>
                    <ManageUsers></ManageUsers>
                </AdminRoute>
            },
            {
                path: "creator/my-contests",
                element: <CreatorRoute>
                    <MyCreatedContests></MyCreatedContests>
                </CreatorRoute>
            },
            {
                path: "creator/contest/task/:id",
                element: <CreatorRoute>
                    <TaskSubmissions></TaskSubmissions>
                </CreatorRoute>
            },
            {
                path: "user/contest/participation",
                element: <UserRoute>
                    <MyParticipatedContests></MyParticipatedContests>
                </UserRoute>
            },
            {
                path: "user/contest/wins",
                element: <UserRoute>
                    <MyWinningContests></MyWinningContests>
                </UserRoute>
            },
            {
                path: "payment/success",
                Component: PaymentSuccess
            },
            {
                path: "payment/failed",
                Component: PaymentFail
            },
            {
                path: "contest/:id/submissions",
                element: <CreatorRoute>
                    <TaskSubmissions></TaskSubmissions>
                </CreatorRoute>
            }
        ]
    },
    {
        path: '*',
        Component: ErrorPage
    },
    {
        path: '/test',
        Component: TestAnimation
    }
]);

export default router;