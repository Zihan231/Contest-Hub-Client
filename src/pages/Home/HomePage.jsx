import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Banner from '../../components/Banner/Banner';
import PopularContests from '../../components/PopularContests/PopularContests';
import WinnerSection from '../../components/WinnerSection/WinnerSection';

const HomePage = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularContests></PopularContests>
            <WinnerSection></WinnerSection>
        </div>
    );
};

export default HomePage;