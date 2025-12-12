import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../../context/AuthContext/AuthContext";
import Loading from "../../components/Loading/Loading";

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { user, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return (
            <Loading></Loading>
        );
    }
    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    }
    return children;
};

export default PrivateRoute;