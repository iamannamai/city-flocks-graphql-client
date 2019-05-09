import axios from 'axios';
import { BASE_URL } from '../constants/constants';

/**
 * ACTION TYPES
 */
const SET_GAME = 'SET_GAME';
const COMPLETE_TASK = 'COMPLETE_TASK';

/**
 * INITIAL STATE
 */
const defaultState = {
  data: {},
  tasks: [],
  teammates: []
};

/**
 * ACTION CREATORS
 */
const setGame = game => ({ type: SET_GAME, game });
const setTaskComplete = taskId => ({ type: COMPLETE_TASK, taskId });

/**
 * THUNK CREATORS
 */
export const getCurrentGame = () => async dispatch => {
  try {
    const { data: currentGame } = await axios.get(`${BASE_URL}/api/events`);
    dispatch(setGame(currentGame || []));
  } catch (error) {
    console.error(error);
  }
};

// export const completeTask = taskId => async dispatch => {
//   try {
//     const { data: completedTask } = await axios.post(`${BASE_URL}/api/eventTeams/${}/`);
//   } catch (error) {
//     console.error(error);
//   }
// };

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
          task.id === action.taskId
            ? {...task, completed: true}
            : task
        ))
      };
    default:
      return state;
  }
};
