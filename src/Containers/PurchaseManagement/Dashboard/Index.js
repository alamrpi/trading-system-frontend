import React from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";

const Index = () => {
    return (
        <MainSection title='Dashboard' breadcrumbPaths={[{name: 'Home', path: '/'}]}>
            <h1>Hello from Dashboard</h1>
        </MainSection>
    );
};

export default Index;