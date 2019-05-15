import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const RESET_APP = 'RESET_APP';

/**
 * INITIAL STATE
 */

// const defaultUser = {};
import { defaultUser } from './defaultState';

/**
 * ACTION CREATORS
 */
export const getUser = user => ({ type: GET_USER, user });
// const removeUser = () => ({ type: REMOVE_USER });
const resetApp = () => ({type: RESET_APP});

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`);
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    console.error(err);
  }
};

export const userTeamThunk = (userId) => async dispatch => {
  try {
    console.log(userId);
    const id = parseInt(userId);
    const res = await axios.get(`${BASE_URL}/api/users/${id}/team`);
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    console.error(err);
  }
};

export const auth = (credentials, method) => async dispatch => {
  let res;
  try {
    res = await axios.post(`${BASE_URL}/auth/${method}`, credentials);
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }

  try {
    dispatch(getUser(res.data));
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`);
    dispatch(resetApp());
  } catch (err) {
    console.error(err);
  }
};

export const removeUserTeamThunk = (userId) => async dispatch => {
  try {
    const res = await axios.put(`${BASE_URL}/api/users/${userId}/team`);
    dispatch(getUser(res.data));
  } catch (err) {
    console.error(err);
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    default:
      return state;
  }
}
