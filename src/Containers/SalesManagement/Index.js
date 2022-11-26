import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import SalesManagementSidebar from "../../Data/SalesManagementSidebar";
import SalesManagementRoutes from "../../Routes/SalesManagementRoutes";

const Index = () => {
    return (
        <Layout sideMenus={SalesManagementSidebar}>
            <SalesManagementRoutes/>
        </Layout>
    );
};

export default Index;