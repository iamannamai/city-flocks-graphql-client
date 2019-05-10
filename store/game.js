import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_GAME = 'SET_GAME';
const COMPLETE_TASK = 'COMPLETE_TASK';
const END_GAME = 'END_GAME';

/**
 * INITIAL STATE
 */
const defaultState = {
  eventId: 0,
  tasks: [],
  teammates: [],
};

/**
 * ACTION CREATORS
 */
const setGameEvent = eventId => ({ type: SET_GAME, eventId });
const setTasks = tasks => ({ type: SET_TASKS, tasks });
const setTaskComplete = taskId => ({ type: COMPLETE_TASK, taskId });
const endGame = () => ({ type: END_GAME });

/**
 * THUNK CREATORS
 */

export const startGame = (eventId, teamId) => async dispatch => {
  try {
    // dispatch set eventId to the selectedEvent
    const {data: game} = await axios.put(`${BASE_URL}/api/eventTeams/event/${eventId}/team/${teamId}/activate`);
    // send request to start game
    dispatch(setGameEvent);
  } catch (error) {
    console.error(error);
  }
};

// retrieve tasks & teammates
export const getTasks = (eventId, teamId) => async dispatch => {
  try {
    const {data: tasks} = await axios.get(`${BASE_URL}/api/eventTeam/event/${eventId}/team/${teamId}/tasks`);
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error(error);
  }
};

// retrieve current game
export const getCurrentGame = () => async dispatch => {
  try {
    const { data: currentGame } = await axios.get(`${BASE_URL}/api/eventTeams/event/${eventId}/`);
    dispatch(setGameEvent(currentGame.eventId || []));
  } catch (error) {
    console.error(error);
  }
};

export const getGameTasks = eventId => async dispatch => {
  try {
    const { data: game } = await axios.get(
      `${BASE_URL}/api/events/${eventId}/tasks`
    );
    dispatch(setTasks(game.tasks));
  } catch (error) {
    console.error(error);
  }
};

export const completeTask = (eventId, teamId, taskId) => async dispatch => {
  try {
    const { data: completedTask } = await axios.post(`${BASE_URL}/api/eventTeamTasks/event/${eventId}/team/${teamId}/task/${taskId}`);
    dispatch(setTaskComplete(completedTask.taskId));
  } catch (error) {
    console.error(error);
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_GAME:
      return {
        ...state,
        data: action.game,
        tasks: []
      };
    case COMPLETE_TASK:
      return {
        ...state,
        tasks: this.state.tasks.map(task => (
          task.id === action.taskId ? { ...task, completed: true } : task
        ))
      };
    default:
      return state;
  }
};
