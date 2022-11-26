import {AUTHENTICATE, LOG_OUT} from "../Helpers/ActionsConstant";

export const authenticate = (token, roles) => {
    return {
        type: AUTHENTICATE,
        roles: roles,
        token: token
    }
}

export const logout = () => {
    return {
        type: LOG_OUT
    }
}
