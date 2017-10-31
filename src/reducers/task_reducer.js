import { GET_TRAIN_TASK_LIST, GET_OPERATIONS_TASK_LIST } from '../actions/task_action';

const initState = {
  trainTaskList: [], // {userName: 'public', taskName: 'plate', time: '2017-08-07 15:41:40', taskType: '0', taskState: '3', progress: '100.0'}
  operationsTaskList: [], //task_middleware 34
}

const taskReducer = (state=initState, action) => {
  const { trainTaskList, operationsTaskList } = action;
  switch (action.type) {
    case GET_TRAIN_TASK_LIST: {
      return {
        ...state,
        trainTaskList
      }
    }
    case GET_OPERATIONS_TASK_LIST: {
      return {
        ...state,
        operationsTaskList
      }
    }
    default: return state;
  }
}

export default taskReducer;
