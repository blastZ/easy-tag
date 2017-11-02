import { GET_TRAIN_TASK_LIST, GET_OPERATIONS_TASK_LIST, GET_OPERATIONS_COUNT } from '../actions/task_action';

const initState = {
  trainTaskList: [], // {userName: 'public', taskName: 'plate', time: '2017-08-07 15:41:40', taskType: '0', taskState: '3', progress: '100.0'}
  operationsTaskList: [], //task_middleware 34
  operationsCount: 0,
  pageCount: 1
}

const taskReducer = (state=initState, action) => {
  const { trainTaskList, operationsTaskList, operationsCount } = action;
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
    case GET_OPERATIONS_COUNT: {
      return {
        ...state,
        operationsCount,
        pageCount: Math.ceil(operationsCount / 20)
      }
    }
    default: return state;
  }
}

export default taskReducer;
