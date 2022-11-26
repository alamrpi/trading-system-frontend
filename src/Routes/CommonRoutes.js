import React from 'react';
import {Route, Routes} from "react-router-dom";
import RequireAuth from "../Hoc/Auth/RequireAuth";
import Authorize from "../Hoc/Auth/Authorize";
import {
    ADMIN,
    SUPER_ADMIN,
    HR_MANAGEMENT,
    PRODUCT_MANAGEMENT,
    PURCHASE_MANAGEMENT,
    STOCK_INVENTORY,
    SALES_MANAGEMENT, ACCOUNTANT
} from "../Const/Roles";

const Home = React.lazy(() => import('../Containers/Home/Index'));
const Login = React.lazy(() => import('../Containers/Auth/Login/Index'));
const Accounting = React.lazy(() => import('../Containers/Accounting/Index'));
const SalesManagement = React.lazy(() => import('../Containers/SalesManagement/Index'));
const StockInventory = React.lazy(() => import('../Containers/StockInventory/Index'));
const PurchaseManagement = React.lazy(() => import('../Containers/PurchaseManagement/Index'));
const ProductManagement = React.lazy(() => import('../Containers/ProductManagement/Index'));
const HrManagement = React.lazy(() => import('../Containers/HrManagement/Index'));
const AppSettings = React.lazy(() => import('../Containers/AppSettings/Index'));
const Modules = React.lazy(() => import('../Containers/AppModules/Index'));
const SuperAdmin = React.lazy(() => import('../Containers/SuperAdmin/Index'));
const ChangePassword = React.lazy(() => import('../Containers/Auth/Profile/ChangePassword'));
const ChangeProfile = React.lazy(() => import('../Containers/Auth/Profile/UpdateProfile'));

const CommonRoutes = () => {
    return (
        <Routes>
            <Route path='/*' element={<Home/>}>
                <Route index element={
                    <RequireAuth>
                        <Modules/>
                    </RequireAuth>
                }/>
                <Route path='change-password' element={<RequireAuth><ChangePassword /></RequireAuth>}></Route>
                <Route path='profile' element={<RequireAuth><ChangeProfile /></RequireAuth>}></Route>
                <Route path='accounting/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN, ACCOUNTANT]}>
                            <Accounting/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='sales-management/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN, SALES_MANAGEMENT]}>
                            <SalesManagement/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='stock-inventory/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN, STOCK_INVENTORY]}>
                            <StockInventory/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='purchase-management/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN, PURCHASE_MANAGEMENT]}>
                            <PurchaseManagement/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='pdm/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN, PRODUCT_MANAGEMENT]}>
                            <ProductManagement/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='hr/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN, HR_MANAGEMENT]}>
                            <HrManagement/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='app-settings/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[ADMIN]}>
                            <AppSettings/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='super-admin/*' element={
                    <RequireAuth>
                        <Authorize accessRoles={[SUPER_ADMIN]}>
                            <SuperAdmin/>
                        </Authorize>
                    </RequireAuth>
                }/>
                <Route path='login' element={<Login/> }/>
            </Route>
        </Routes>
    );
};

export default CommonRoutes;