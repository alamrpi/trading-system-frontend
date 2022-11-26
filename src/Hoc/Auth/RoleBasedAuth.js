import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import Loader from "../../Components/UserInterface/Loader/Index";

const RoleBasedAuth = ({children, accessRoles}) => {

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
        return null;

    return children
};

export default RoleBasedAuth;