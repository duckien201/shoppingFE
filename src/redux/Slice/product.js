import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:"product",
    initialState:{
        item:JSON.parse(localStorage.getItem("item"))
    },
    reducers:{
        viewProductDetail:(state,action)=>{
            state.item=action.payload
        }
    }
})

export const {viewProductDetail} = productSlice.actions
export default productSlice.reducer