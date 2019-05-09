import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_MY_TEAM = 'SET_MY_TEAM';
const CREATE_TEAM = 'CREATE_TEAM';

/**
 * INITIAL STATE
 */
const defaultState = {
	myTeam: {}
};

/**
 * ACTION CREATORS
 */
const setMyTeam = team => ({ type: SET_MY_TEAM, team });
const createTeam = team => ({ type: CREATE_TEAM, team});

/**
 * THUNK CREATORS
 */
export const getTeamDataThunk = teamId => async dispatch => {
	try {
		const {data: team} = await axios.get(`${BASE_URL}/api/teams/${teamId}/users`);
		dispatch(setMyTeam(team));
	} catch (error) {
		console.error(error);
	}
};

export const createTeamThunk = teamName => async dispatch => {
	try {
		const res =
			await axios.post(`${BASE_URL}/api/teams`, {name: teamName});
		dispatch(createTeam(res));
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
			return { ...state, myTeam: action.team};
		case CREATE_TEAM:
			return { ...state, myTeam: action.team};
		default:
			return state;
	}
}
