import React from 'react';
import HomePage from '../../pages/Home/HomePage';
import NavBar from '../../components/NavBar/NavBar';
import { Outlet } from 'react-router';

const HomeLayout = () => {
    return (
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
            
        </div>
    );
};

export default HomeLayout;