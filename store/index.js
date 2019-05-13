import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import user from './user';
import event from './event';
import team from './team';
import game from './game';
import { defaultEvent,defaultGame,defaultTeam,defaultUser } from './defaultState';

const rootReducer = combineReducers({ user, event, team, game });
const defaultState = {
    user: defaultUser,
    event: defaultEvent,
    team: defaultTeam,
    game: defaultGame
}

const reducer = (state, action) => {
    if (action.type === 'RESET_APP') {
      state = defaultState;
    }
    return rootReducer(state, action);
  }

const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './event';
export * from './team';
export * from './game';
