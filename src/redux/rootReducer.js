import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./Slice/auth"
import cartReducer from "./Slice/cart"
import productReducer from "./Slice/product"

const rootReducer = combineReducers({

    auth: authReducer,
    cart:cartReducer,
    product:productReducer,
});
export default rootReducer;