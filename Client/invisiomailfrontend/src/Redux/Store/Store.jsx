import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../Slice/authslice"

export const Store = configureStore({
    reducer: {
        auth: authReducer,
    },
});