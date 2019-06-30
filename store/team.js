import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { me } from './user';

/**
 * ACTION TYPES
 */
const SET_MY_TEAM = 'SET_MY_TEAM';
const CREATE_TEAM = 'CREATE_TEAM';
const LEAVE_TEAM = 'LEAVE_TEAM';

/**
 * INITIAL STATE
 */

// const defaultState = {
//   myTeam: {},
//   potentialTeammates: []
// };
import { defaultTeam } from './defaultState';
//import { startGameThunk } from './game';

/**
 * ACTION CREATORS
 */
const setMyTeam = team => ({ type: SET_MY_TEAM, team });
const createTeam = team => ({ type: CREATE_TEAM, team });
const leaveTeam = () => ({ type: LEAVE_TEAM });

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

export const leaveTeamThunk = userId => async dispatch => {
  try {
    await axios.put(`${BASE_URL}/api/users/${userId}/team`);
    dispatch(leaveTeam());
    dispatch(me());
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = defaultTeam, action) {
  switch (action.type) {
    case SET_MY_TEAM:
      return { ...state, myTeam: action.team };
    case CREATE_TEAM:
      return { ...state, myTeam: action.team };
    case LEAVE_TEAM:
      return defaultTeam;
    default:
      return state;
  }
}
