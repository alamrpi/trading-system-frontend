import {CHANGE_STORE_STATUS, SET_STORE, SET_STORES} from "../Helpers/ActionsConstant";
import axios from "axios";
import {setError} from "../Errors/ErrorActions";
import {errorHandler} from "../../Shared/utility";

export const setStores = (stores, totalRows, currentPage) => {
    return {
        type: SET_STORES,
        stores: stores,
        totalRows: totalRows,
        pageNumber: currentPage
    }
}

export const setStore = (store) => {
    return {
        type: SET_STORE,
        store: store
    }
}


export const changeStoreStatus = (id, status) => {
    return {
        type: CHANGE_STORE_STATUS,
        id: id,
        status: status
    }
}

export const getStore = (id, token) => {
    return dispatch => {
        axios.get(`/v1/stores/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                dispatch(setStore(data));
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
        });
    }
}



