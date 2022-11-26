import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Dashboard = lazy(() =>
  import('../Containers/SuperAdmin/Dashboard/Index')
);

const Businesses = lazy(() =>
  import('../Containers/SuperAdmin/Businesses/Index')
);
const AddOrUpdateBusiness = lazy(() =>
  import('../Containers/SuperAdmin/Businesses/AddOrUpdateBusiness')
);
const DetailsBusiness = lazy(() =>
  import('../Containers/SuperAdmin/Businesses/Details')
);
const DetailsUsers = lazy(() =>
  import('../Containers/SuperAdmin/Users/DetailsUsers')
);
const AddOrUpdateUsers = lazy(() =>
  import('../Containers/SuperAdmin/Users/AddOrUpdateUsers')
);
const Users = lazy(() => import('../Containers/SuperAdmin/Users/Index'));

const Store = lazy(() => import('../Containers/SuperAdmin/Stores/Index'));
const AddOrUpdateStore = lazy(() =>
  import('../Containers/SuperAdmin/Stores/AddOrUpdateBusiness')
);
const DetailsStore = lazy(() =>
  import('../Containers/SuperAdmin/Stores/Details')
);

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path='stores/details/:id' element={<DetailsStore />}></Route>
      <Route path='stores/update/:id' element={<AddOrUpdateStore />}></Route>
      <Route path='stores/add' element={<AddOrUpdateStore />}></Route>
      <Route path='stores' element={<Store />}></Route>

      <Route
        path='businesses/details/:id'
        element={<DetailsBusiness />}
      ></Route>
      <Route
        path='businesses/update/:id'
        element={<AddOrUpdateBusiness />}
      ></Route>
      <Route path='businesses/add' element={<AddOrUpdateBusiness />}></Route>
      <Route path='businesses' element={<Businesses />}></Route>

      <Route path='users/details/:id' element={<DetailsUsers />}></Route>
      <Route path='users/update/:id' element={<AddOrUpdateUsers />}></Route>
      <Route path='users/add' element={<AddOrUpdateUsers />}></Route>
      <Route path='users' element={<Users />}></Route>

      <Route index element={<Dashboard />}></Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
