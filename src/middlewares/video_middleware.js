import { SAVE_VIDEO_LABEL, GET_VIDEO_LABEL, ADD_NEW_VIDEO,
         GET_VIDEO_LIST, DELETE_VIDEO } from '../actions/video_action';

const videoMiddleware = store => next => action => {
  const appState = store.getState().appReducer;
  const url = appState.defaultURL;
  if(action.type === GET_VIDEO_LIST) {
    fetch(`${url}getdir?usrname=fj&taskname=aa&start=1&num=10`)
      .then((response) => (response.json()))
      .then((result) => {
        if(result.length > 0) {
          store.dispatch({
            type: GET_VIDEO_LABEL,
            fileName: result[0].name
          })
        }
        next({
          type: GET_VIDEO_LIST,
          videoList: result
        })
      })
  } else if(action.type === ADD_NEW_VIDEO) {
    const { file } = action;
    const formData = new FormData();
    formData.append('file', file);
    fetch(`${url}uploadfile?usrname=fj&taskname=aa&filename=${file.name}`, {
      method: 'POST',
      body: formData
    })
    next({
      type: ADD_NEW_VIDEO,
      file
    })
  } else if(action.type === SAVE_VIDEO_LABEL) {
    const { fileName, videoLabelList } = action;
    fetch(`${url}savelabel?usrname=fj&taskname=aa&filename=${fileName}`, {
      method: 'POST',
      body: JSON.stringify(videoLabelList)
    })
  } else if(action.type === GET_VIDEO_LABEL) {
    const { fileName } = action;
    fetch(`${url}loadlabel?usrname=fj&taskname=aa&filename=${fileName}`)
      .then((response) => (response.json()))
      .then((result) => {
        if(result.length === 0) result = [];
        next({
          type: GET_VIDEO_LABEL,
          videoLabelList: result
        })
      })
  } else if(action.type === DELETE_VIDEO) {
    const { index } = action;
    const fileName = store.getState().videoReducer.videoList[index].name;
    fetch(`${url}delfile?usrname=fj&taskname=aa&filename=${fileName}`)
    next({
      type: DELETE_VIDEO,
      index
    })
  } else {
    next(action);
  }
}

export default videoMiddleware;
