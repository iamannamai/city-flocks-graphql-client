import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_GAME = 'SET_GAME';
const SET_TASKS = 'SET_TASKS';
const COMPLETE_TASK = 'COMPLETE_TASK';
const END_GAME = 'END_GAME';

/**
 * INITIAL STATE
 */
const defaultState = {
  eventId: 0,
  eventTeamId: 0,
  tasks: [],
  teammates: [],
  endTime: Date.now()
};

/**
 * ACTION CREATORS
 */
const setGameEvent = game => ({ type: SET_GAME, game });
const setTasks = tasks => ({ type: SET_TASKS, tasks });
const setTaskComplete = taskId => ({ type: COMPLETE_TASK, taskId });
const setEndGame = () => ({ type: END_GAME });

/**
 * THUNK CREATORS
 */

export const startGameThunk = eventTeamId => async dispatch => {
  try {
    // dispatch set eventId to the selectedEvent
    const {data: game} = await axios.put(`${BASE_URL}/api/eventTeams/${eventTeamId}/activate`);
    // send request to start game
    dispatch(setGameEvent(game));
  } catch (error) {
    console.error(error);
  }
};

export const endGameThunk = eventTeamId => async dispatch => {
  try {
    await axios.put(`${BASE_URL}/api/eventTeams/${eventTeamId}/complete`);
    dispatch(setEndGame());
  } catch (error) {
    console.error(error);
  }
};

// retrieve tasks & teammates
export const getTasksThunk = eventTeamId => async dispatch => {
  try {
    const {data: eventTeam} = await axios.get(`${BASE_URL}/api/eventTeams/${eventTeamId}/tasks`);
    dispatch(setTasks(eventTeam.tasks));
  } catch (error) {
    console.error(error);
  }
};

// retrieve current game
export const getCurrentGameThunk = eventTeamId => async dispatch => {
  try {
    const { data: currentGame } = await axios.get(`${BASE_URL}/api/eventTeams/${eventTeamId}/tasks`);
    dispatch(setGameEvent(currentGame.eventId || []));
  } catch (error) {
    console.error(error);
  }
};

export const completeTaskThunk = (eventTeamId, taskId) => async dispatch => {
  try {
    const { data: completedTask } = await axios.put(`${BASE_URL}/api/eventTeamTasks/${eventTeamId}/task/${taskId}`);
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
        eventId: action.game.eventId,
        eventTeamId: action.game.id,
        endTime: action.game.endTime
      };
    case SET_TASKS:
      return {
        ...state,
        tasks: action.tasks
      };
    case COMPLETE_TASK:
      return {
        ...state,
        tasks: this.state.tasks.map(task => (
          task.id === action.taskId ? { ...task, completed: true } : task
        ))
      };
    case END_GAME:
      return defaultState;
    default:
      return state;
  }
};
