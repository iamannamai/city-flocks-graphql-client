import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_EVENTS = 'SET_EVENTS';

/**
 * INITIAL STATE
 */
const defaultState = {
	allEvents: []
};

/**
 * ACTION CREATORS
 */
const setEvents = events => ({ type: SET_EVENTS, events });

/**
 * THUNK CREATORS
 */
export const getEventsThunk = () => async dispatch => {
	try {
		const {data: events} = await axios.get(`${BASE_URL}/api/events`);
		dispatch(setEvents(events));
	} catch (error) {
		console.error(error);
	}
};

/**
 * REDUCER
 */
export default function(state = defaultState, action) {
	switch (action.type) {
		case SET_EVENTS:
			return {...state, allEvents: action.events};
		default:
			return state;
	}
}
