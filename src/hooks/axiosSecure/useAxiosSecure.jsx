import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext';


const instance = axios.create({
    baseURL: "http://localhost:3000/"
})
const useAxiosSecure = () => {
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const requestInterceptor = instance.interceptors.request.use(configs => {
            configs.headers.authorization = `Bearer ${user?.accessToken}`;
            return configs;
        });
        return () => {
            instance.interceptors.request.eject(requestInterceptor);
        }
    }, [user])
    return instance;
}


export default useAxiosSecure;