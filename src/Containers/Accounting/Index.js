import React from 'react';
import Layout from '../../Hoc/Layout/Index'
import AccountingRoutes from "../../Routes/AccountingRoutes";
import AccountingSidebar from "../../Data/AccountingSidebar";

const Index = () => {
    return (
       <Layout sideMenus={AccountingSidebar}>
           <AccountingRoutes/>
       </Layout>
    );
};

export default Index;