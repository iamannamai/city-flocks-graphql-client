import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_EVENTS = 'SET_EVENTS';
const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';

/**
 * INITIAL STATE
 */
const defaultState = {
  allEvents: [],
  selectedEventId: 0
};

/**
 * ACTION CREATORS
 */
const setEvents = events => ({ type: SET_EVENTS, events });

export const setSelectedEvent = eventId => ({
  type: SET_SELECTED_EVENT,
  eventId
});

/**
 * THUNK CREATORS
 */
export const getEventsThunk = () => async dispatch => {
  try {
    const { data: events } = await axios.get(`${BASE_URL}/api/events`);
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
      return { ...state, allEvents: action.events };
    case SET_SELECTED_EVENT:
      return { ...state, selectedEventId: action.eventId };
    default:
      return state;
  }
}
