import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import HrManagementSidebar from "../../Data/HrManagementSidebar";
import HrManagementRoutes from "../../Routes/HrManagementRoutes";

const Index = () => {
    return (
        <Layout sideMenus={HrManagementSidebar}>
            <HrManagementRoutes/>
        </Layout>
    );
};

export default Index;