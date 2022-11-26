import {
    SET_PROFILE_INFO
} from "../Helpers/ActionsConstant";
import {updateObject} from "../../Shared/utility";

const initialState = {
    profileInfo: null,
};

const setProfileInfo = (state, {profileInfo}) => {
    return updateObject(state, {
        profileInfo: profileInfo,
    });
}

const ProfileReducer = (state = initialState, action) => {
    switch (action.type){
        case SET_PROFILE_INFO: return setProfileInfo(state, action);
        default:
            return state;
    }
}

export default ProfileReducer;