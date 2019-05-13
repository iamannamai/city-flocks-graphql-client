import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import socket, { BROADCAST_GAME_START } from '../socket';

/**
 * ACTION TYPES
 */
const SET_GAME = 'SET_GAME';
const SET_TASKS = 'SET_TASKS';
const SET_TEAM_TASKS = 'SET_TEAM_TASKS';
const COMPLETE_TASK = 'COMPLETE_TASK';
const END_GAME = 'END_GAME';

/**
 * INITIAL STATE
 */

// const defaultState = {
//   eventId: 0,
//   eventTeamId: 0,
//   tasks: [],
//   teamTasks: [],
//   teammates: [],
//   endTime: Date.now()
// };
import { defaultGame } from './defaultState';

/**
 * ACTION CREATORS
 */
export const setGameEvent = game => ({ type: SET_GAME, game });
const setGameTasks = tasks => ({ type: SET_TASKS, tasks });
const setTeamTasks = tasks => ({ type: SET_TEAM_TASKS, tasks});
const setTaskComplete = taskId => ({ type: COMPLETE_TASK, taskId });
const setEndGame = () => ({ type: END_GAME });

/**
 * THUNK CREATORS
 */
export const startGameThunk = eventTeamId => async dispatch => {
  try {
    // dispatch set eventId to the selectedEvent
    const {data: game} = await axios.put(`${BASE_URL}/api/eventTeams/${eventTeamId}/activate`);
    socket.emit(BROADCAST_GAME_START, game);
    // send request to start game
    dispatch(setGameEvent(game));
  } catch (error) {
    console.error(error);
  }
};

export const resumeGameThunk = eventTeamId => async dispatch => {
  try {
    // dispatch set eventId to the selectedEvent
    const {data: game} = await axios.get(`${BASE_URL}/api/eventTeams/${eventTeamId}`);
    // send request to start game
    dispatch(setGameEvent(game));
  } catch (error) {
    console.error(error);
  }
};

export const endGameThunk = (eventTeamId) => async dispatch => {
  try {
    await axios.put(`${BASE_URL}/api/eventTeams/${eventTeamId}/complete`);
    dispatch(setEndGame());
  } catch (error) {
    console.error(error);
  }
};

export const getGameTasksThunk = eventId => async dispatch => {
  try {
    const {data: eventTasks} = await axios.get(`${BASE_URL}/api/events/${eventId}/tasks`);
    dispatch(setGameTasks(eventTasks.tasks));
  } catch (error) {
    console.error(error);
  }
};

// retrieve tasks & teammates
export const getTeamTasksThunk = eventTeamId => async dispatch => {
  try {
    const {data: teamTasks} = await axios.get(`${BASE_URL}/api/eventTeams/${eventTeamId}/tasks`);
    const tasks = teamTasks.tasks.map(task => (
      {
        ...task.event_team_task,
        name: task.name,
        points: task.points,
        description: task.description
      }
    ));
    dispatch(setTeamTasks(tasks));
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
    const { data: completedTask } = await axios.put(`${BASE_URL}/api/eventTeamTasks`, {
      eventTeamId,
      taskId,
      completed: true
    });
    dispatch(setTaskComplete(completedTask.taskId));
  } catch (error) {
    console.error(error);
  }
};

export default (state = defaultGame, action) => {
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
    case SET_TEAM_TASKS:
      return {
        ...state,
        teamTasks: action.tasks,
        teamTasksRemaining: action.tasks.reduce((count, current) => {
          return current.completed ? count : ++count;
        }, 0)
      };
    case COMPLETE_TASK:
      return {
        ...state,
        teamTasks: state.teamTasks.map(task => (
          task.id === action.taskId ? { ...task, completed: true } : task
        )),
        teamTasksRemaining: state.teamTasksRemaining - 1
      };
    case END_GAME:
      return defaultGame;
    default:
      return state;
  }
};
