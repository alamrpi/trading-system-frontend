import React from 'react';
import {Backdrop, CircularProgress} from "@mui/material";
import {useSelector} from "react-redux";

const OverlayLoader = () => {

    const open = useSelector(({overlayLoader}) => {
        return overlayLoader.open
    })
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={() =>{}}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default OverlayLoader;