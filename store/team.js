import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_MY_TEAM = 'SET_MY_TEAM';
const CREATE_TEAM = 'CREATE_TEAM';
const ADD_TO_TEAM = 'ADD_TO_TEAM';
const SET_AVAILABLE_USERS = 'SET_AVAILABLE_USERS';

/**
 * INITIAL STATE
 */
const defaultState = {
  myTeam: {},
  potentialTeammates: []
};

/**
 * ACTION CREATORS
 */
const setMyTeam = team => ({ type: SET_MY_TEAM, team });
const createTeam = team => ({ type: CREATE_TEAM, team });
const setAvailableUsers = users => ({ type: SET_AVAILABLE_USERS, users });
const addToTeam = user => ({ type: ADD_TO_TEAM, user});

/**
 * THUNK CREATORS
 */
export const getTeamDataThunk = teamId => async dispatch => {
  try {
    const { data: team } = await axios.get(
      `${BASE_URL}/api/teams/${teamId}/users`
    );
    dispatch(setMyTeam(team));
  } catch (error) {
    console.error(error);
  }
};

export const createTeamThunk = teamName => async dispatch => {
  try {
    const res = await axios.post(`${BASE_URL}/api/teams`, { name: teamName });
    dispatch(createTeam(res));
  } catch (error) {
    console.error(error);
  }
};

export const getAvailableUsersThunk = () => async dispatch => {
  try {
    const { data: users } = await axios.get(`${BASE_URL}/api/users/available`);
    dispatch(setAvailableUsers(users));
  } catch (error) {
    console.error(error);
  }
};

export const addUserToTeamThunk = (teamId, userId) => async dispatch => {
  try {
    const { data: user } = await axios.post(
      `${BASE_URL}/api/teams/${teamId}/addUser`,
      { userId }
    );
    dispatch(addToTeam(user));
  } catch (error) {
    console.error(error);
  }
};

/**
 * REDUCER
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case SET_MY_TEAM:
      return { ...state, myTeam: action.team };
    case CREATE_TEAM:
      return { ...state, myTeam: action.team };
    case ADD_TO_TEAM:
      return {
        ...state,
        myTeam: {
          ...state.myTeam,
          users: [...state.myTeam.users, action.user]
        },
        potentialTeammates: state.potentialTeammates.filter(user => user.id !== action.user.id)
      };
    case SET_AVAILABLE_USERS:
      return { ...state, potentialTeammates: action.users };
    default:
      return state;
  }
}
