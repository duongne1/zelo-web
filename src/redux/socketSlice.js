import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        currentSocket: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        getSocketStart: (state) => {
            state.isFetching = true;
        },
        getSocketSuccess: (state, action) => {
            state.isFetching = false;
            state.currentSocket = action.payload;
        },
        getSocketFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const { getSocketStart, getSocketSuccess, getSocketFailed } = socketSlice.actions;

export default socketSlice.reducer;
