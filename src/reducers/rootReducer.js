import { combineReducers } from 'redux';
import appReducer from './app_reducer';
import taskReducer from './task_reducer';
import videoReducer from './video_reducer';
import testAllReducer from '../testPageForAll/reducers/test_all_reducer';
import daubReducer from '../daub_page/daub_reducer';

export default combineReducers({
    appReducer,
    taskReducer,
    videoReducer,
    testAllReducer,
    daubReducer
})
