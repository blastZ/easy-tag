import { GET_TRAIN_TASK_LIST } from '../actions/task_action';

const getTrainTaskList = (data) => {
  const arrayData = data.split(',');
  const trainTaskList = [];
  for(let i=0; i<arrayData.length; i=i+6) {
      const userName = arrayData[i].slice(4, arrayData[i].length - 1);
      const taskName = arrayData[i + 1].slice(3, arrayData[i + 1].length - 1);
      const time = arrayData[i + 2].slice(3, arrayData[i + 2].length - 1);
      const taskType = arrayData[i + 3].slice(1, 2);
      const taskState = arrayData[i + 4].slice(1, 2);
      let progress = '';
      if(i + 5 === arrayData.length - 1) {
          progress = arrayData[i + 5].slice(1, arrayData[i + 5].length - 2);
      } else {
          progress = arrayData[i + 5].slice(1, arrayData[i + 5].length - 1);
      }
      trainTaskList.push({userName, taskName, time, taskType, taskState, progress});
  }
  return trainTaskList;
}

const taskMiddleware = store => next => action => {
  const appState = store.getState().appReducer;
  const url = appState.defaultURL;
  if(action.type === GET_TRAIN_TASK_LIST) {
    fetch(`${url}gettrainingtaskinfo`, {
      method: 'POST',
      body: appState.managerData
    }).then(
      (response) => (response.text())
    ).then((result) => {
      const trainTaskList = getTrainTaskList(result);
      next({
        type: GET_TRAIN_TASK_LIST,
        trainTaskList
      })
    })

  } else {
    next(action)
  }
}

export default taskMiddleware;
