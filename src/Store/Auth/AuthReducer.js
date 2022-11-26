import {
    AUTHENTICATE, LOG_OUT

} from "../Helpers/ActionsConstant";
import {updateObject} from "../../Shared/utility";
import * as localforage from "localforage";


const initialState = {
    token: null,
    roles: [],
};

const authenticate = (state, {token, roles}) => {
    return updateObject(state, {
        token: token,
        roles: roles,
    });
}

const logout = (state) => {
    localforage.removeItem('token').then();
    return updateObject(state, {
        token: null,
        roles: [],
        userInfo: null
    });
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type){
        case AUTHENTICATE: return authenticate(state, action);
        case LOG_OUT: return logout(state);
        default:
            return state;
    }
}

export default AuthReducer;