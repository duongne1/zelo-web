import axios from 'axios';
import { loginFailed, loginStart, loginSuccess, logOutFailed, logOutStart, logOutSuccess } from './authSlice';
import {
    deleteUserFailed,
    deleteUsersSuccess,
    deleteUserStart,
    getUsersFailed,
    getUsersStart,
    getUsersSuccess,
} from './userSlice';
import config from '~/config';
import {
    getConversationsStart,
    getConversationsSuccess,
    getConversationsFailed,
    getConversationsByIdStart,
    getConversationsByIdSuccess,
    getConversationsByIdFailed,
} from './conversationSlice';
import io from 'socket.io-client';
import { getSocketStart, getSocketSuccess, getSocketFailed } from './socketSlice';
//npm install axios

export const getSocketConnection = async (dispatch) => {
    dispatch(getSocketStart());
    try {
        const socket = await io(`${process.env.REACT_APP_IP_SOCKET}`);
        dispatch(getSocketSuccess(socket));
    } catch (err) {
        dispatch(getSocketFailed());
    }
};

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/auth/login', user);
        dispatch(loginSuccess(res.data));
        navigate(config.routes.home);
        return null;
    } catch (err) {
        dispatch(loginFailed());
        return err;
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/auth/signup', user);
        dispatch(loginSuccess(res.data));
        navigate(config.routes.home);
        return null;
    } catch (err) {
        dispatch(loginFailed());
        return err;
    }
};

export const getUserLogin = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/auth/' + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getUsersFailed());
    }
};

export const getConversationsByUserId = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(getConversationsStart());
    try {
        const res = await axiosJWT.get(
            'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationByUserId/' + id,
            {
                headers: { token: `Bearer ${accessToken}` },
            },
        );
        dispatch(getConversationsSuccess(res.data));
    } catch (err) {
        dispatch(getConversationsFailed());
    }
};
export const getConversationsById = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(getConversationsByIdStart());
    try {
        const res = await axiosJWT.get(
            'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationById/' + id,
            {
                headers: { token: `Bearer ${accessToken}` },
            },
        );
        dispatch(getConversationsByIdSuccess(res.data));
    } catch (err) {
        dispatch(getConversationsByIdFailed());
    }
};
export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete('/v1/user/' + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUsersSuccess(res.data));
    } catch (err) {
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        navigate(config.routes.login);
    } catch (err) {
        dispatch(logOutFailed());
    }
};
