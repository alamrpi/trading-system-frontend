import React, {useEffect, useState} from 'react';
import Loader from "../../Components/UserInterface/Loader/Index";
import UnAuthorized from "../../Components/UserInterface/UnAuthorized";
import {useSelector} from "react-redux";

const Authorize = ({children, accessRoles}) => {

    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);

    const {roles} = useSelector(({auth}) => {
        return auth;
    });

    //call component mounted
    useEffect(() => {
        let isAccess = false;

        accessRoles.forEach((role) => {
            isAccess = roles.includes(role) || isAccess;
        });

        setAuthorize(isAccess);
        setLoading(false);

    },[]);

    if(loading)
        return <Loader/>;

    if(!authorize)
        return <UnAuthorized/>

    return children
};

export default Authorize;