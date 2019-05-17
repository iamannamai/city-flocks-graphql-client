import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { END_GAME } from './game';
/**
 * ACTION TYPES
 */
const SET_EVENTS = 'SET_EVENTS';
const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
const SET_MY_EVENTS = 'SET_MY_EVENTS';
const JOIN_EVENT = 'JOIN_EVENT';
const SET_ACTIVE_EVENT = 'SET_ACTIVE_EVENT';

/**
 * INITIAL STATE
 */

// const defaultState = {
//   allEvents: [],
//   // stores array of event_team objects relevant to my team
//   myEvents: [],
//   // stores array of just eventIds from myEvents
//   myEventIds: [],
//   selectedEventId: 0
// };
import { defaultEvent } from './defaultState';

/**
 * ACTION CREATORS
 */
const setEvents = events => ({ type: SET_EVENTS, events });
const setMyEvents = myEvents => ({ type: SET_MY_EVENTS, myEvents });
const joinEvent = event => ({ type: JOIN_EVENT, event });
export const setActiveEvent = event => ({ type: SET_ACTIVE_EVENT, event});

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
		// the attribute event_team comes from the route response
    const myEvents = events.map(({ event_team }) => event_team);
    dispatch(setMyEvents(myEvents));
  } catch (error) {
    console.error(error);
  }
};

export const joinEventThunk = (eventId, teamId) => async dispatch => {
	try {
		const {data: eventTeam} = await axios.post(`${BASE_URL}/api/eventTeams`, {
			eventId, teamId
		});
		dispatch(joinEvent(eventTeam));
	} catch (error) {
		console.error(error);
	}
};

/**
 * REDUCER
 */
export default function(state = defaultEvent, action) {
  switch (action.type) {
    case SET_EVENTS:
      return { ...state, allEvents: action.events };
    case SET_MY_EVENTS:
      return {
        ...state,
        myEvents: action.myEvents,
        myEventIds: action.myEvents.map(event => event.eventId),
        myActiveEvent: action.myEvents.find(event => event.status === 'ACTIVE')
      };
    case SET_SELECTED_EVENT:
			return { ...state, selectedEventId: action.eventId };
		case JOIN_EVENT:
			return {
				...state,
				myEvents: [...state.myEvents, action.event],
				myEventIds: [...state.myEventIds, action.event.eventId]
      };
    case SET_ACTIVE_EVENT:
      return {
        ...state,
        myActiveEvent: {
          ...action.event,
          status: 'ACTIVE'
        }
      };
    case END_GAME:
      return {
        ...state,
        myActiveEvent: {},
        myEvents: state.myEvents.map(event => {
          return event.id === action.game.id
            ? {
              ...event,
              score: action.game.score,
              status: 'COMPLETE'
            }
            : event;
        })
      };
    default:
      return state;
  }
}
