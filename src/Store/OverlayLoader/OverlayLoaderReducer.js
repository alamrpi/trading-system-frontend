import {updateObject} from "../../Shared/utility";
import {LOADER_CLOSE, LOADER_OPEN} from "../Helpers/ActionsConstant";

const initialState = {
    open: false,
};

const openLoader = (state) => {
    return updateObject(state, {
        open: true
    });
};

const closeLoader = (state) => {
    return updateObject(state, {
        open: false
    });
}
const BusinessReducer = (state = initialState, action) => {
    switch (action.type){
        case LOADER_OPEN: return openLoader(state);
        case LOADER_CLOSE: return closeLoader(state);
        default:
            return state;
    }
}

export default BusinessReducer;