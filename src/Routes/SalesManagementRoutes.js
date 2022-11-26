import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const CustomerDetails = lazy(() => import('../Containers/SalesManagement/Customers/Details'));
const CustomerCreateOrEdit = lazy(() => import('../Containers/SalesManagement/Customers/CreateOrUpdate'));
const Customer = lazy(() => import('../Containers/SalesManagement/Customers/Index'));

const Dashboard = lazy(() => import('../Containers/SalesManagement/Dashboard/Index'));

const InvoicesEdit = lazy(() => import('../Containers/SalesManagement/Sales/Edit'));
const InvoicesDetails = lazy(() => import('../Containers/SalesManagement/Sales/Details'));
const Invoices = lazy(() => import('../Containers/SalesManagement/Sales/Invoices'));
const Sales = lazy(() => import('../Containers/SalesManagement/Sales/Create'));

const SalesReturnInvoicesEdit = lazy(() => import('../Containers/SalesManagement/Sales/Return/Edit'));
const SalesReturnInvoiceDetails = lazy(() => import('../Containers/SalesManagement/Sales/Return/Details'));
const SalesReturnInvoice = lazy(() => import('../Containers/SalesManagement/Sales/Return/Invoices'));
const SalesReturn = lazy(() => import('../Containers/SalesManagement/Sales/Return/Create'));

const SalesReturnReport = lazy(() => import('../Containers/SalesManagement/Reports/SalesReturn'));
const SalesReport = lazy(() => import('../Containers/SalesManagement/Reports/Invoices'));

const PurchaseManagementRoutes = () => {
    return (
        <Routes>

                <Route path='reports/sale-return' element={<SalesReturnReport />}></Route>
                <Route path='reports/sales' element={<SalesReport />}></Route>

            <Route path='sales/return/invoices/edit/:id' element={<SalesReturnInvoicesEdit />}></Route>
            <Route path='sales/return/invoices/details/:id' element={<SalesReturnInvoiceDetails />}></Route>
            <Route path='sales/return/invoices' element={<SalesReturnInvoice />}></Route>
            <Route path='sales/:id/return/new' element={<SalesReturn />}></Route>

            <Route path='sales/invoices/edit/:id' element={<InvoicesEdit />}></Route>
            <Route path='sales/invoices/details/:id' element={<InvoicesDetails />}></Route>
            <Route path='sales/invoices' element={<Invoices />}></Route>
            <Route path='sales/new' element={<Sales />}></Route>

            <Route path='customers/details/:id' element={<CustomerDetails />}></Route>
            <Route path='customers/update/:id' element={<CustomerCreateOrEdit />}></Route>
            <Route path='customers/create' element={<CustomerCreateOrEdit />}></Route>
            <Route path='customers' element={<Customer />}></Route>

            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default PurchaseManagementRoutes;