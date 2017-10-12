import { GET_TRAIN_TASK_LIST } from '../actions/task_action';

const initState = {
  trainTaskList: [], // {userName: 'public', taskName: 'plate', time: '2017-08-07 15:41:40', taskType: '0', taskState: '3', progress: '100.0'}
}

const taskReducer = (state=initState, action) => {
  const { trainTaskList } = action;
  switch (action.type) {
    case GET_TRAIN_TASK_LIST: {
      return {
        ...state,
        trainTaskList
      }
    }
    default: return state;
  }
}

export default taskReducer;
