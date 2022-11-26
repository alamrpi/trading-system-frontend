import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import PurchaseManagementSidebar from "../../Data/PurchaseManagementSidebar";
import PurchaseManagementRoutes from "../../Routes/PurchaseManagementRoutes";

const Index = () => {
    return (
        <Layout sideMenus={PurchaseManagementSidebar}>
            <PurchaseManagementRoutes/>
        </Layout>
    );
};

export default Index;