import React, { use } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext';
import useRole from '../../hooks/role/useRole';
import Loading from '../../components/Loading/Loading';
import Forbidden from '../../components/Forbidden/Forbidden';

const UserRoute = ({children}) => {
    const { isLoading } = use(AuthContext);
    const { role, roleLoading } = useRole();
    if (isLoading || roleLoading) {
        <Loading></Loading>
    }
    if (role !== 'user') {
        return <Forbidden></Forbidden>
    }
    return children
};

export default UserRoute;