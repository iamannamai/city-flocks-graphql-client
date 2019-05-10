import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_EVENTS = 'SET_EVENTS';
const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
const SET_MY_EVENTS = 'SET_MY_EVENTS';

/**
 * INITIAL STATE
 */
const defaultState = {
  allEvents: [],
  // stores array of event_team objects relevant to my team
  myEvents: [],
  // stores array of just eventIds from myEvents
  myEventIds: [],
  selectedEventId: 0
};

/**
 * ACTION CREATORS
 */
const setEvents = events => ({ type: SET_EVENTS, events });
const setMyEvents = myEvents => ({ type: SET_MY_EVENTS, myEvents });

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

export const getMyEventsThunk = teamId => async dispatch => {
  try {
    const { data: team } = await axios.get(
      `${BASE_URL}/api/teams/${teamId}/events`
    );
    const { events } = team;
    const myEvents = events.map(({ event_team }) => event_team);
    dispatch(setMyEvents(myEvents));
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
    case SET_MY_EVENTS:
      return {
        ...state,
        myEvents: action.myEvents,
        myEventIds: action.myEvents.map(event => event.eventId)
      };
    case SET_SELECTED_EVENT:
      return { ...state, selectedEventId: action.eventId };
    default:
      return state;
  }
}
