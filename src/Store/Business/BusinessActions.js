import {
    BUSINESS_DDL_LOADING,
    BUSINESS_DDL_SET_DATA,
    BUSINESS_GETS,
    BUSINESS_STATUS_CHANGE,
    SET_LOADING
} from "../Helpers/ActionsConstant";
import axios from "axios";
import {setError} from "../Errors/ErrorActions";
import {errorHandler} from "../../Shared/utility";

export const setBusinessLoading = (isLoading) => {
    return {
        type: SET_LOADING,
        isLoading: isLoading
    }
}

export const getBusinesses = (payload) => {
    return {
        type: BUSINESS_GETS,
        ...payload
    }
}

export const changeStatusBusiness = (status, id) => {
    return {
        type: BUSINESS_STATUS_CHANGE,
        id: id,
        status: status
    }
}

export const setBusinessDdlLoading = (isLoading) => {
    return {
        type: BUSINESS_DDL_LOADING,
        isLoading: isLoading
    }
}

export const setBusinessDdlData = (data) => {
    return {
        type: BUSINESS_DDL_SET_DATA,
        data: data
    }
}

export const getBusinessForDdl = (token) => {
    return dispatch => {
        dispatch(setBusinessDdlLoading(true));
        axios.get(`/v1/businesses/for-ddl`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                console.log(data)
                dispatch(setBusinessDdlData(data));
            }
        }).catch(error => {
            dispatch(setBusinessDdlLoading(false));
            dispatch(setError(errorHandler(error)));
        })
    }
}