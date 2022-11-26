import React, { Suspense } from 'react';
import CommonRoutes from '../Routes/CommonRoutes';
import Loader from '../Components/UserInterface/Loader/Index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ErrorDialog from "../Components/UserInterface/ErrorDialog/ErrorDialog";
import Notify from "../Components/UserInterface/Notify/Notify";
import OverlayLoader from "../Components/UserInterface/OverlayLoader/OverlayLoader";

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <CommonRoutes />
        <ErrorDialog/>
        <Notify/>
        <OverlayLoader/>
    </Suspense>
  );
}

export default App;
