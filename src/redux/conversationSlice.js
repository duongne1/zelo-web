import { createSlice } from '@reduxjs/toolkit';

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState: {
        currentConversation: null,
        currentConversationById: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        getConversationsStart: (state) => {
            state.isFetching = true;
        },
        getConversationsSuccess: (state, action) => {
            state.isFetching = false;
            state.currentConversation = action.payload;
        },
        getConversationsFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        getConversationsByIdStart: (state) => {
            state.isFetching = true;
        },
        getConversationsByIdSuccess: (state, action) => {
            state.isFetching = false;
            state.currentConversationById = action.payload;
        },
        getConversationsByIdFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getConversationsStart,
    getConversationsSuccess,
    getConversationsFailed,
    getConversationsByIdStart,
    getConversationsByIdSuccess,
    getConversationsByIdFailed,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
