import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const Dashboard = lazy(() => import('../Containers/HrManagement/Dashboard/Index'));
const Designation = lazy(() => import('../Containers/HrManagement/Designations/Index'));
const DesignationCreateOrUpdate = lazy(() => import('../Containers/HrManagement/Designations/CreateOrUpdate'));

const SalaryReviewsDetails = lazy(() => import('../Containers/HrManagement/Employees/SalaryReviews/Details'));
const SalaryReviewsEdit = lazy(() => import('../Containers/HrManagement/Employees/SalaryReviews/Edit'));
const SalaryReviewsCreate = lazy(() => import('../Containers/HrManagement/Employees/SalaryReviews/Create'));
const SalaryReviews = lazy(() => import('../Containers/HrManagement/Employees/SalaryReviews/Index'));

const EmployeeTransferCreate = lazy(() => import('../Containers/HrManagement/Employees/TransferOrPromotion'));
const EmployeeInfoUpdate = lazy(() => import('../Containers/HrManagement/Employees/EditEmployeeInfo'));
const EmployeeUpdate = lazy(() => import('../Containers/HrManagement/Employees/Edit'));
const EmployeeDetails = lazy(() => import('../Containers/HrManagement/Employees/Details'));
const EmployeeCreate = lazy(() => import('../Containers/HrManagement/Employees/Create'));
const Employees = lazy(() => import('../Containers/HrManagement/Employees/CurrentList'));

const HrManagementRoutes = () => {
    return (
        <Routes>
            <Route path='employees/salary-reviews/:id/details' element={<SalaryReviewsDetails/>}></Route>
            <Route path='employees/salary-reviews/:id/edit' element={<SalaryReviewsEdit/>}></Route>
            <Route path='employees/salary-reviews/:employeeId/create' element={<SalaryReviewsCreate/>}></Route>
            <Route path='employees/salary-reviews' element={<SalaryReviews/>}></Route>

            <Route path='employees/transfer-promotion/:userId' element={<EmployeeTransferCreate/>}></Route>
            <Route path='employees/update-employee-info/:id' element={<EmployeeInfoUpdate/>}></Route>
            <Route path='employees/update/:id' element={<EmployeeUpdate/>}></Route>
            <Route path='employees/details/:id' element={<EmployeeDetails/>}></Route>
            <Route path='employees/create' element={<EmployeeCreate/>}></Route>
            <Route path='employees' element={<Employees/>}></Route>

            <Route path='designations/update/:id' element={<DesignationCreateOrUpdate />}></Route>
            <Route path='designations/create' element={<DesignationCreateOrUpdate />}></Route>
            <Route path='designations' element={<Designation />}></Route>

            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default HrManagementRoutes;