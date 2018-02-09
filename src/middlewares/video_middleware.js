import { SAVE_VIDEO_LABEL, GET_VIDEO_LABEL, ADD_NEW_VIDEO,
         GET_VIDEO_LIST, DELETE_VIDEO, GET_TAG_LIST,
         SAVE_TAG_LIST, GET_FILE_COUNT, GET_LABELED_FILE_COUNT } from '../actions/video_action';

const videoMiddleware = store => next => action => {
  const appState = store.getState().appReducer;
  const videoState = store.getState().videoReducer;
  const userName = appState.userName;
  const taskName = appState.taskName;
  const url = appState.defaultURL;
  if(action.type === GET_VIDEO_LIST) {
    const { start, num, callback } = action;
    fetch(`${url}getdir?usrname=${userName}&taskname=${taskName}&start=${start}&num=${num}&video=1`)
      .then((response) => (response.json()))
      .then((result) => {
        if(result.length > 0) {
          store.dispatch({
            type: GET_VIDEO_LABEL,
            fileName: result[0].name
          })
          if(callback !== null) {
            callback(result[0].url);
          }
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
    fetch(`${url}uploadvideofile?usrname=${userName}&taskname=${taskName}&filename=${file.name}`, {
      method: 'POST',
      body: formData
    }).then((response) => response.text())
      .then((result) => {
        next({
          type: ADD_NEW_VIDEO,
          file,
          url: result
        })
      })
  } else if(action.type === SAVE_VIDEO_LABEL) {
    const { fileName, videoLabelList } = action;
    fetch(`${url}savelabel?usrname=${userName}&taskname=${taskName}&filename=${fileName}`, {
      method: 'POST',
      body: JSON.stringify(videoLabelList)
    })
  } else if(action.type === GET_VIDEO_LABEL) {
    const { fileName } = action;
    fetch(`${url}loadlabel?usrname=${userName}&taskname=${taskName}&filename=${fileName}`)
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
    fetch(`${url}delfile?usrname=${userName}&taskname=${taskName}&filename=${fileName}`)
    next({
      type: DELETE_VIDEO,
      index
    })
  } else if(action.type === GET_TAG_LIST) {
    fetch(`${url}loadtag?usrname=${userName}&taskname=${taskName}`)
      .then((response) => (response.json()))
      .then((result) => {
        const listNameList = result.listname;
        const tagList = result.taglist;
        const tagStringList = tagList[listNameList[0]];
        next({
          type: GET_TAG_LIST,
          listNameList,
          tagList,
          tagStringList,
        })
      })
  } else if(action.type === SAVE_TAG_LIST) {
    const listNameList = videoState.listNameList;
    const tagList = videoState.tagList;
    const data = {
      listname: listNameList,
      taglist: tagList
    }
    fetch(`${url}savetag?usrname=${userName}&taskname=${taskName}`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  } else if(action.type === GET_FILE_COUNT) {
    fetch(`${url}filecount?usrname=${userName}&taskname=${taskName}`)
      .then((response) => (response.json()))
      .then((result) => {
        next({
          type: GET_FILE_COUNT,
          fileCount: parseInt(result, 10)
        })
      })
  } else if(action.type === GET_LABELED_FILE_COUNT) {
    fetch(`${url}labeledfilecount?usrname=${userName}&taskname=${taskName}`)
      .then((response) => (response.json()))
      .then((result) => {
        next({
          type: GET_LABELED_FILE_COUNT,
          labeledFileCount: result
        })
      })
  } else {
    next(action);
  }
}

export default videoMiddleware;
