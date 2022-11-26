import {SET_PROFILE_INFO} from "../Helpers/ActionsConstant";

export const setProfileInfo = (profileInfo) => {
    return {
        type: SET_PROFILE_INFO,
        profileInfo: profileInfo,
    }
}
