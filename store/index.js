import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import user from './user'
import event from './event'
import team from './team'

const reducer = combineReducers({user, event, team})
const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './event'
export * from './team'
