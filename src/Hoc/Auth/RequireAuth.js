import React, {useEffect, useState} from 'react';
import Loader from "../../Components/UserInterface/Loader/Index";
import {useDispatch, useSelector} from "react-redux";
import {Navigate, useLocation} from "react-router-dom";
import localforage from "localforage";
import jwtDecode from "jwt-decode";
import {authenticate, logout} from "../../Store/Auth/AuthActions";
import axios from "axios";
import {errorHandler} from "../../Shared/utility";
import {setError} from "../../Store/Errors/ErrorActions";
import {setProfileInfo} from "../../Store/Profile/ProfileActions";

const RequireAuth = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticate, setAuthenticate] = useState(false);
    const {token} = useSelector(({auth}) => {
        return auth
    });

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if(token === null){
            localforage.getItem('token').then((value) => {
               if(value){
                   checkTokenValidate(value);
               }
               else {
                    setAuthenticate(false);
                    setLoading(false);
                }
            }).catch(() => {
                setAuthenticate(false);
                setLoading(false);
            });
        }else{
            setLoading(false);
            setAuthenticate(true);
        }
    },[]);

    const checkTokenValidate = (token) => {
        const decodeToken = jwtDecode(token);
        const expirationTime = new Date(decodeToken.exp * 1000);
        if(expirationTime < new Date()){
            dispatch(logout());
            setAuthenticate(false);
            setLoading(false);
        }
        else{
            let roles = [];
            if(Array.isArray(decodeToken.role))
                roles = decodeToken.role;
            else
                roles.push(decodeToken.role);

            dispatch(authenticate(token, roles))
            loadUserInfo(token);
        }
    }
    const loadUserInfo = (token) => {
        /// Get user info code here
        setAuthenticate(true);
        axios.get('v1/common/authentications/get-profile-info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            dispatch(setProfileInfo(res.data));
            setLoading(false);
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            dispatch(logout());
            setAuthenticate(false);
            setLoading(false);
        });

    }

    if(loading)
        return <Loader/>;

    if(!isAuthenticate)
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;

    return children;
};

export default RequireAuth;