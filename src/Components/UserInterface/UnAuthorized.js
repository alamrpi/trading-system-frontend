import React from 'react';
import {Link} from "@mui/material";

const UnAuthorized = () => {
    return (
        <div className='alert alert-warning'>
            <strong>Un authorized page</strong>
            <Link to='/'>Back To Home</Link>
        </div>
    );
};

export default UnAuthorized;