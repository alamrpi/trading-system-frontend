import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const SuppliersDetails = lazy(() => import('../Containers/PurchaseManagement/Suppliers/Details'));
const SuppliersCreatOrEdit = lazy(() => import('../Containers/PurchaseManagement/Suppliers/CreateOrUpdate'));
const Suppliers = lazy(() => import('../Containers/PurchaseManagement/Suppliers/Index'));

const PurchaseReturnInvoicesEdit = lazy(() => import('../Containers/PurchaseManagement/Purchase/Return/Edit'));
const PurchaseReturnInvoicesDetails = lazy(() => import('../Containers/PurchaseManagement/Purchase/Return/Details'));
const PurchaseReturnInvoices = lazy(() => import('../Containers/PurchaseManagement/Purchase/Return/Invoices'));
const PurchaseReturn = lazy(() => import('../Containers/PurchaseManagement/Purchase/Return/Create'));

const InvoicesEdit = lazy(() => import('../Containers/PurchaseManagement/Purchase/Edit'));
const InvoicesDetails = lazy(() => import('../Containers/PurchaseManagement/Purchase/Details'));
const Invoices = lazy(() => import('../Containers/PurchaseManagement/Purchase/Invoices'));
const Purchase = lazy(() => import('../Containers/PurchaseManagement/Purchase/Create'));

const PurchaseReturnReport = lazy(() => import('../Containers/PurchaseManagement/Reports/PurchaseReports'));
const PurchaseReport = lazy(() => import('../Containers/PurchaseManagement/Reports/PurchaseReports'));

const Dashboard = lazy(() => import('../Containers/PurchaseManagement/Dashboard/Index'));

const PurchaseManagementRoutes = () => {
    return (
        <Routes>
            <Route path='purchase-return-reports' element={<PurchaseReturnReport />}></Route>
            <Route path='purchases-reports' element={<PurchaseReport />}></Route>

            <Route path='purchases/return/invoices/edit/:id' element={<PurchaseReturnInvoicesEdit />}></Route>
            <Route path='purchases/return/invoices/details/:id' element={<PurchaseReturnInvoicesDetails />}></Route>
            <Route path='purchases/return/invoices' element={<PurchaseReturnInvoices />}></Route>
            <Route path='purchases/:id/return/new' element={<PurchaseReturn />}></Route>

            <Route path='purchases/invoices/edit/:id' element={<InvoicesEdit />}></Route>
            <Route path='purchases/invoices/details/:id' element={<InvoicesDetails />}></Route>
            <Route path='purchases/invoices' element={<Invoices />}></Route>
            <Route path='purchases/new' element={<Purchase />}></Route>

            <Route path='suppliers/details/:id' element={<SuppliersDetails />}></Route>
            <Route path='suppliers/update/:id' element={<SuppliersCreatOrEdit />}></Route>
            <Route path='suppliers/create' element={<SuppliersCreatOrEdit />}></Route>
            <Route path='suppliers' element={<Suppliers />}></Route>

            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default PurchaseManagementRoutes;