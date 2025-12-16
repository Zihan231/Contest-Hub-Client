import React, { useContext } from 'react';
import { useQuery } from "@tanstack/react-query";
import AuthContext from '../../context/AuthContext/AuthContext';
import useAxiosSecure from '../axiosSecure/useAxiosSecure';

const useRole = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const { data: userData, isLoading } = useQuery({
        queryKey: ["user-role", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`public/user/getRole/${user?.email}`);
            return res.data;
        }
    })
    const role = userData?.role;
    return { role, isLoading };
};

export default useRole;