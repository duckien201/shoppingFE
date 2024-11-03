import { createSlice } from "@reduxjs/toolkit";
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null
    },
    reducers: {
        signin: (state, action) => {
            // state.isAuthenticated = true
            // state.user = action.payload
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('isAuthenticated', true);
        },
        logout: (state, action) => {
            // state.isAuthenticated = false
            // state.user = null
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('item');
            localStorage.removeItem('order');
            localStorage.removeItem('shopOrder');
        },
        loadUserFromLocalStorage: (state) => {
            const user = JSON.parse(localStorage.getItem('user'));
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (user && isAuthenticated) {
                state.user = user;
                state.isAuthenticated = isAuthenticated;
            }
        }
    }
})
export const { signin, logout ,loadUserFromLocalStorage} = authSlice.actions
export default authSlice.reducer