import {CONFIRM_ERROR, SET_ERROR} from "../Helpers/ActionsConstant";

export const setError = (errorMessage) => {
    return {
        type: SET_ERROR,
        errorMessage: errorMessage
    }
}

export const confirmError = () => {
    return {
        type: CONFIRM_ERROR
    }
}
