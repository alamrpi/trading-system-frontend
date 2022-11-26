import {updateObject} from "../../Shared/utility";
import {CONFIRM_ERROR, SET_ERROR} from "../Helpers/ActionsConstant";

const initialState = {
    isConfirmError: true,
    errorMessage: null
};

const setErrorMessage = (state, {errorMessage}) => {
    return updateObject(state, {
        isConfirmError: false,
        errorMessage: errorMessage
    });
};

const confirmError = (state) => {
    return updateObject(state, {
        isConfirmError: true,
        errorMessage: null
    });
}


const BusinessReducer = (state = initialState, action) => {
    switch (action.type){
        case SET_ERROR: return setErrorMessage(state, action);
        case CONFIRM_ERROR: return confirmError(state);
        default:
            return state;
    }
}

export default BusinessReducer;