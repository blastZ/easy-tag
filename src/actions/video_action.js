export const ADD_NEW_VIDEO_LABEL = 'ADD_NEW_VIDEO_LABEL';
export const REMOVE_VIDEO_LABEL = 'REMOVE_VIDEO_LABEL';
export const ADD_NEW_VIDEO = 'ADD_NEW_VIDEO';
export const SAVE_VIDEO_LABEL = 'SAVE_VIDEO_LABEL';
export const GET_VIDEO_LABEL = 'GET_VIDEO_LABEL';
export const GET_VIDEO_LIST = 'GET_VIDEO_LIST';
export const INIT_STATE = 'INIT_STATE';
export const DELETE_VIDEO = 'DELETE_VIDEO';

export const getVideoList = () => ({
  type: GET_VIDEO_LIST
})

export const addNewVideoLabel = (label) => ({
  type: ADD_NEW_VIDEO_LABEL,
  label
})

export const removeVideoLabel = (index) => ({
  type: REMOVE_VIDEO_LABEL,
  index
})

export const addNewVideo = (file) => ({
  type: ADD_NEW_VIDEO,
  file
})

export const saveVideoLabel = (fileName, videoLabelList) => ({
  type: SAVE_VIDEO_LABEL,
  fileName,
  videoLabelList
})

export const getVideoLabel = (fileName) => ({
  type: GET_VIDEO_LABEL,
  fileName
})

export const initState = () => ({
  type: INIT_STATE
})

export const deleteVideo = (index) => ({
  type: DELETE_VIDEO,
  index
})
