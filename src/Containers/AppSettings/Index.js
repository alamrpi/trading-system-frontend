import React from 'react';
import Layout from "../../Hoc/Layout/Index";
import AppSettingsSidebar from "../../Data/AppSettingsSidebar";
import AppSettingsRoutes from "../../Routes/AppSettingsRoutes";

const Index = () => {
    return (
        <Layout sideMenus={AppSettingsSidebar}>
            <AppSettingsRoutes/>
        </Layout>
    );
};

export default Index;