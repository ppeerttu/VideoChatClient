import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAIL,
  REQUEST_USER,
  REQUEST_USER_SUCCESS,
  REQUEST_USER_FAIL,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL
} from './types';

export const login = (username, password) => {
  return {
    apiCall: {
      method: 'post',
      path: '/api/login',
      types: [REQUEST_LOGIN, REQUEST_LOGIN_SUCCESS, REQUEST_LOGIN_FAIL],
      data: {username, password}
    }
  }
};

export const fetchUser = () => {
  return {
    apiCall: {
      method: 'get',
      path: '/api/users/me',
      types: [REQUEST_USER, REQUEST_USER_SUCCESS, REQUEST_USER_FAIL]
    }
  };
};

export const fetchToken = () => {
  return {
    apiCall: {
      method: 'get',
      path: '/api/token',
      types: [REFRESH_TOKEN, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAIL]
    }
  }
};
