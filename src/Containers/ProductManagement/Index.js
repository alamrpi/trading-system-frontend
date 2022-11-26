import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import ProductManagementSidebar from "../../Data/ProductManagementSidebar";
import ProductManagementRoutes from "../../Routes/ProductManagementRoutes";

const Index = () => {
    return (
        <Layout sideMenus={ProductManagementSidebar}>
            <ProductManagementRoutes/>
        </Layout>
    );
};

export default Index;