import { GET_TRAIN_TASK_LIST, GET_OPERATIONS_TASK_LIST } from '../actions/task_action';

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

const getOperationsTaskList = (data) => {
  const arrayData = data.split('(');
  const operationsTaskList = [];
  for(let i=1; i<arrayData.length; i++) {
    const itemData = arrayData[i].split(',');
    console.log(itemData);
    const userName = itemData[0].slice(2, itemData[0].length - 1);
    const ip = itemData[1].slice(3, itemData[1].length - 1);
    const time = itemData[2].slice(3, itemData[2].length - 1);
    const operationType = itemData[3].slice(3, itemData[3].length - 1);
    let operationDetail = '';
    if(itemData.length === 6) {
      operationDetail += itemData[4].slice(3, itemData[4].length - 2);
    } else if(itemData.length === 5) {
      operationDetail += itemData[4].slice(3, itemData[4].length - 3);
    } else {
      for(let j=4; j<itemData.length; j++) {
        if(j === 4) {
          operationDetail += itemData[j].slice(3, itemData[j].length);
        } else if(j === itemData.length - 2) {
          if(i !== arrayData.length - 1) {
            operationDetail += itemData[j].slice(0, itemData[j].length - 2);
          } else {
            operationDetail += itemData[j].slice(0, itemData[j].length - 3);
          }
        } else {
          operationDetail += itemData[j];
        }
      }
    }
    operationsTaskList.push({
      userName,
      ip,
      time,
      operationType,
      operationDetail
    })
  }
  return operationsTaskList;
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

  } else if(action.type === GET_OPERATIONS_TASK_LIST) {
    const { userName, start, num } = action;
    fetch(`${url}getoperations?usrname=${userName}&start=${start}&num=${num}`)
      .then((response) => response.text())
      .then((result) => {
        const operationsTaskList = getOperationsTaskList(result);
        next({
          type: GET_OPERATIONS_TASK_LIST,
          operationsTaskList
        })
      })
  } else {
    next(action)
  }
}

export default taskMiddleware;
