import React from 'react';
import Module from "./Module";
import {
    ACCOUNTANT, ADMIN,
    HR_MANAGEMENT,
    PRODUCT_MANAGEMENT,
    PURCHASE_MANAGEMENT,
    SALES_MANAGEMENT,
    STOCK_INVENTORY, SUPER_ADMIN
} from "../../Const/Roles";

const Index = () => {

    const modules = [
        {
            title: 'Accounting',
            subTitle: 'Business, Stores, users operations here for it company.',
            path: '/accounting',
            roles: [ADMIN, ACCOUNTANT]
        },
        {
            title: 'Sales Management',
            subTitle: 'Business, Stores, users operations here for it company.',
            path: '/sales-management',
            roles: [ADMIN, SALES_MANAGEMENT]
        },
        {
            title: 'Stock & Inventory',
            subTitle: 'Business, Stores, users operations here for it company.',
            path: '/stock-inventory/',
            roles: [STOCK_INVENTORY, ADMIN]
        },
        {
            title: 'Purchase Management',
            subTitle: 'Business, Stores, users operations here for it company.',
            path: '/purchase-management/',
            roles: [PURCHASE_MANAGEMENT, ADMIN]
        },
        {
            title: 'Product Management',
            subTitle: 'Business, Stores, users operations here for it company.',
            path: '/pdm/',
            roles: [PRODUCT_MANAGEMENT,ADMIN]
        },
        {
            title: 'Human Resource Management',
            subTitle: 'Employees designations, history, transfers, promotions, salary assign and working permissions.',
            path: '/hr/',
            roles: [HR_MANAGEMENT, HR_MANAGEMENT]
        },
        {
            title: 'Business Settings',
            subTitle: 'Business basic configuration, business info update etc.',
            path: '/app-settings/',
            roles: [ADMIN]
        },
        {
            title: 'Super Administrations',
            subTitle: 'Business, Stores, users operations here for it company.',
            path: '/super-admin/',
            roles: [SUPER_ADMIN]
        }
    ];


    return (
        <div className='row mt-md-5 mt-2'>
            <div className='col-md-8 offset-md-2'>
               <div className='row'>
                   {modules.map((module, idx) => (
                       <Module key={idx} {...module}/>
                   ))}
               </div>
            </div>
        </div>
    );
};

export default Index;