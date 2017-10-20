import { SAVE_VIDEO_LABEL, GET_VIDEO_LABEL, ADD_NEW_VIDEO,
         GET_VIDEO_LIST, DELETE_VIDEO, GET_TAG_LIST,
         SAVE_TAG_LIST, } from '../actions/video_action';

const videoMiddleware = store => next => action => {
  const appState = store.getState().appReducer;
  const videoState = store.getState().videoReducer;
  const userName = 'fj';
  const taskName = 'yy';
  const url = appState.defaultURL;
  if(action.type === GET_VIDEO_LIST) {
    const { start, num } = action;
    fetch(`${url}getdir?usrname=${userName}&taskname=${taskName}&start=${start}&num=${num}`)
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
    fetch(`${url}uploadfile?usrname=${userName}&taskname=${taskName}&filename=${file.name}`, {
      method: 'POST',
      body: formData
    })
    next({
      type: ADD_NEW_VIDEO,
      file
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
  } else {
    next(action);
  }
}

export default videoMiddleware;
