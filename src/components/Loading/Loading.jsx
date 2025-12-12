import React from 'react';
import { HashLoader } from 'react-spinners';

const Loading = () => {
    return (

        <main className="flex items-center justify-center min-h-[500px]">
            <HashLoader color="#73abff" size={80} />
        </main>
    );
};

export default Loading;