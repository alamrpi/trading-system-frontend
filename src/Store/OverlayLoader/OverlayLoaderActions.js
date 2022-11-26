import {LOADER_CLOSE, LOADER_OPEN} from "../Helpers/ActionsConstant";

export const openLoader = () => {
    return {
        type: LOADER_OPEN
    }
}

export const closeLoader = () => {
    return {
        type: LOADER_CLOSE
    }
}
