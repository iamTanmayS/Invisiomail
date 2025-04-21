import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../../Api/UserFunctions';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

// Create async thunk for fetching user
export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await fetchUserProfile();
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const { setUser, setLoading, setError, clearUser } = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;