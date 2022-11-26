import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const Dashboard = lazy(() => import('../Containers/StockInventory/Dashboard/Index'));

const StoresDetails = lazy(() => import('../Containers/StockInventory/Stores/Details'));
const StoresCreateOrEdit = lazy(() => import('../Containers/StockInventory/Stores/AddOrUpdateBusiness'));
const Stores = lazy(() => import('../Containers/StockInventory/Stores/Index'));

const Stocks = lazy(() => import('../Containers/StockInventory/Stocks/Index'));

const Damages = lazy(() => import('../Containers/StockInventory/Stocks/Damage/Index'));
const DamagesCreate = lazy(() => import('../Containers/StockInventory/Stocks/Damage/Create'));

const StockReports = lazy(() => import('../Containers/StockInventory/Stocks/Reports/Stock'));
const DamageReports = lazy(() => import('../Containers/StockInventory/Stocks/Reports/Damage'));

const StockInventoryRoutes = () => {
    return (
        <Routes>
            <Route path='damages/reports' element={<DamageReports />}></Route>
            <Route path='stocks/reports' element={<StockReports />}></Route>

            <Route path='damages/:id' element={<DamagesCreate />}></Route>
            <Route path='damages' element={<Damages />}></Route>

            <Route path='stocks' element={<Stocks />}></Route>

            <Route path='stores/details/:id' element={<StoresDetails />}></Route>
            <Route path='stores/update/:id' element={<StoresCreateOrEdit />}></Route>
            <Route path='stores/create' element={<StoresCreateOrEdit />}></Route>
            <Route path='stores' element={<Stores />}></Route>

            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default StockInventoryRoutes;