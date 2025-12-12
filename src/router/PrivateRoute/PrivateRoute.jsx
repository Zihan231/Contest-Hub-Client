import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../../context/AuthContext/AuthContext";
import { HashLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    console.log(location);
    const { user, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return (
            <main className="flex items-center justify-center min-h-[500px]">
                <HashLoader color="#73abff" size={80} />
            </main>
        );
    }
    if (!user) {
        return <Navigate state={{from: location.pathname}} to="/login"></Navigate>
    }
    return children;
};

export default PrivateRoute;