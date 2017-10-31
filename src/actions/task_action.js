export const GET_TRAIN_TASK_LIST = 'GET_TRAIN_TASK_LIST';
export const GET_OPERATIONS_TASK_LIST = 'GET_OPERATIONS_TASK_LIST';

export const getTrainTaskList = () => ({
  type: GET_TRAIN_TASK_LIST
})

export const getOperationsTaskList = (userName, start, num) => ({
  type: GET_OPERATIONS_TASK_LIST,
  userName,
  start,
  num
})
