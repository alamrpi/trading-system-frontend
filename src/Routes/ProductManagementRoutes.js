import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const Dashboard = lazy(() => import('../Containers/ProductManagement/Dashboard/Index'));

const CreateVariation = lazy(() => import('../Containers/ProductManagement/Units/CreateVariation'));
const UnitsDetails = lazy(() => import('../Containers/ProductManagement/Units/Details'));
const UnitsUpdate = lazy(() => import('../Containers/ProductManagement/Units/Edit'));
const UnitsCreate = lazy(() => import('../Containers/ProductManagement/Units/Create'));
const Units = lazy(() => import('../Containers/ProductManagement/Units/Index'));

const BrandCreatOrEdit = lazy(() => import('../Containers/ProductManagement/Brands/CreateOrUpdate'));
const Brands = lazy(() => import('../Containers/ProductManagement/Brands/Index'));

const GroupsCreateOrEdit = lazy(() => import('../Containers/ProductManagement/Groups/CreateOrUpdate'));
const Groups = lazy(() => import('../Containers/ProductManagement/Groups/Index'));

const CategoriesCreateOrEdit = lazy(() => import('../Containers/ProductManagement/Categories/CreateOrUpdate'));
const Categories = lazy(() => import('../Containers/ProductManagement/Categories/Index'));

const ProductsDetails = lazy(() => import('../Containers/ProductManagement/Products/Details'));
const ProductsCreateOrEdit = lazy(() => import('../Containers/ProductManagement/Products/CreateOrUpdate'));
const Products = lazy(() => import('../Containers/ProductManagement/Products/Index'));

const ProductManagementRoutes = () => {
    return (
        <Routes>

            <Route path='products/details/:id' element={<ProductsDetails />}></Route>
            <Route path='products/update/:id' element={<ProductsCreateOrEdit />}></Route>
            <Route path='products/create' element={<ProductsCreateOrEdit />}></Route>
            <Route path='products' element={<Products />}></Route>

            <Route path='categories/update/:id' element={<CategoriesCreateOrEdit />}></Route>
            <Route path='categories/create' element={<CategoriesCreateOrEdit />}></Route>
            <Route path='categories' element={<Categories />}></Route>

            <Route path='groups/update/:id' element={<GroupsCreateOrEdit />}></Route>
            <Route path='groups/create' element={<GroupsCreateOrEdit />}></Route>
            <Route path='groups' element={<Groups />}></Route>

            <Route path='brands/update/:id' element={<BrandCreatOrEdit />}></Route>
            <Route path='brands/create' element={<BrandCreatOrEdit />}></Route>
            <Route path='brands' element={<Brands />}></Route>

            <Route path='units/create-variation/:id' element={<CreateVariation />}></Route>
            <Route path='units/details/:id' element={<UnitsDetails />}></Route>
            <Route path='units/update/:id' element={<UnitsUpdate />}></Route>
            <Route path='units/create' element={<UnitsCreate />}></Route>
            <Route path='units' element={<Units />}></Route>

            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default ProductManagementRoutes;