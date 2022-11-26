import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import SuperAdminSidebar from "../../Data/SuperAdminSidebar";
import SuperAdminRoutes from "../../Routes/SuperAdminRoutes";

const Index = () => {
    return (
        <Layout sideMenus={SuperAdminSidebar}>
            <SuperAdminRoutes/>
        </Layout>
    );
};

export default Index;