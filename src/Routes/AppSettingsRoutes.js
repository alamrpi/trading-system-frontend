import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const Dashboard = lazy(() => import('../Containers/AppSettings/Dashboard/Index'));
const BusinessInfo = lazy(() => import('../Containers/AppSettings/BusinessInfo/Index'));
const BasicConfigure = lazy(() => import('../Containers/AppSettings/BasicConfigure/Index'));

const AppSettingsRoutes = () => {
    return (
        <Routes>
            <Route path='basic-configure' element={<BasicConfigure />}></Route>
            <Route path='business-info' element={<BusinessInfo />}></Route>
            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default AppSettingsRoutes;