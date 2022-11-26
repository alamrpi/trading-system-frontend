import {combineReducers} from "redux";
import BusinessReducer from "./Business/BusinessReducer";
import ErrorsReducer from "./Errors/ErrorsReducer";
import StoreReducer from "./BusinessStore/StoreReducer";
import AuthReducer from "./Auth/AuthReducer";
import UsersReducer from "./Users/UsersReducer";
import OverlayLoaderReducer from "./OverlayLoader/OverlayLoaderReducer";
import ProfileReducer from "./Profile/ProfileReducer";

const rootReducer = combineReducers({
    business: BusinessReducer,
    store: StoreReducer,
    auth: AuthReducer,
    error: ErrorsReducer,
    user: UsersReducer,
    overlayLoader: OverlayLoaderReducer,
    profile: ProfileReducer
});

export default  rootReducer;