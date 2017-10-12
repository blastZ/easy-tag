import { combineReducers } from 'redux';
import appReducer from './app_reducer';
import taskReducer from './task_reducer';

export default combineReducers({
    appReducer,
    taskReducer
})
