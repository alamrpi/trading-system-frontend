import {updateObject} from "../../Shared/utility";
import {
    BUSINESS_DDL_LOADING,
    BUSINESS_DDL_SET_DATA,
    BUSINESS_GETS,
    BUSINESS_STATUS_CHANGE,
    SET_LOADING
} from "../Helpers/ActionsConstant";

const initialState = {
    isLoading: true,
    rows: null,
    totalRows: 0,
    pageNumber: 1,

    dropdown:{
        loading: true,
        data: null
    }
};

const setBusinessLoading = (state, {isLoading}) => {
    return updateObject(state, {
        isLoading: isLoading,
    });
};

const getsBusinesses = (state, {rows, pageNumber, totalRows}) => {
    return updateObject(state, {
        isLoading: false,
        rows: rows,
        totalRows: totalRows,
        pageNumber: pageNumber
    });
}

const changeStatus = (state, {id, status}) => {

    let updatedRows = [...state.rows];
    const index = updatedRows.findIndex(x => x.id === id);
    updatedRows[index].isActive = status;

    return updateObject(state, {
        isLoading: false,
        rows: updatedRows
    })
}

//data load for any business dropdown
const setBusinessDdlDataLoading = (state, {isLoading}) => {
    let updatedDdl = {...state.dropdown};
    updatedDdl.loading = isLoading;

    return updateObject(state, {
        dropdown: updatedDdl,
    });
};

const setBusinessDdlData = (state, {data}) => {
    let updatedDdl = {...state.dropdown};

    updatedDdl.loading = false;
    updatedDdl.data = data;

    return updateObject(state, {
        dropdown: updatedDdl,
    });
};

const BusinessReducer = (state = initialState, action) => {
    switch (action.type){
        case SET_LOADING: return setBusinessLoading(state, action);
        case BUSINESS_GETS: return getsBusinesses(state, action);
        case BUSINESS_STATUS_CHANGE: return changeStatus(state, action);
        case BUSINESS_DDL_LOADING: return setBusinessDdlDataLoading(state, action);
        case BUSINESS_DDL_SET_DATA: return setBusinessDdlData(state, action);
        default:
            return state;
    }
}

export default BusinessReducer;
