import React, { use } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext';
import Loading from '../../components/Loading/Loading';
import useRole from '../../hooks/role/useRole';
import { Navigate } from 'react-router';
const AdminRoute = ({ children }) => {
    const { isLoading } = use(AuthContext);
    const { role, roleLoading } = useRole();
    if (isLoading || roleLoading) {
        <Loading></Loading>
    }
    if (role !== 'admin') {
        return <div>Hello</div>
    }
    return children
};

export default AdminRoute;