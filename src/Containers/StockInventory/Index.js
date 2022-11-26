import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import StockInventorySidebar from "../../Data/StockInventorySidebar";
import StockInventoryRoutes from "../../Routes/StockInventoryRoutes";

const Index = () => {
    return (
        <Layout sideMenus={StockInventorySidebar}>
            <StockInventoryRoutes/>
        </Layout>
    );
};

export default Index;