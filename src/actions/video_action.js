export const ADD_NEW_VIDEO_LABEL = 'ADD_NEW_VIDEO_LABEL';
export const REMOVE_VIDEO_LABEL = 'REMOVE_VIDEO_LABEL';
export const ADD_NEW_VIDEO = 'ADD_NEW_VIDEO';
export const SAVE_VIDEO_LABEL = 'SAVE_VIDEO_LABEL';
export const GET_VIDEO_LABEL = 'GET_VIDEO_LABEL';
export const GET_VIDEO_LIST = 'GET_VIDEO_LIST';
export const INIT_STATE = 'INIT_STATE';
export const DELETE_VIDEO = 'DELETE_VIDEO';
export const GET_TAG_LIST = 'GET_TAG_LIST';
export const ADD_NEW_LIST_NAME = 'ADD_NEW_LIST_NAME';
export const SAVE_TAG_LIST = 'SAVE_TAG_LIST';
export const CHANGE_TAG_STRING_LIST = 'CHANGE_TAG_STRING_LIST';
export const EDIT_LIST_NAME = 'EDIT_LIST_NAME';
export const EDIT_TAG_STRING = 'EDIT_TAG_STRING';
export const ADD_NEW_TAG_STRING = 'ADD_NEW_TAG_STRING';
export const DELETE_LIST_NAME = 'DELETE_LIST_NAME';
export const DELETE_TAG_STRING = 'DELETE_TAG_STRING';
export const GET_FILE_COUNT = 'GET_FILE_COUNT';
export const GET_LABELED_FILE_COUNT = 'GET_LABELED_FILE_COUNT';

export const getVideoList = (start, num, callback=null) => ({
  type: GET_VIDEO_LIST,
  start,
  num,
  callback
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

export const getTagList = () => ({
  type: GET_TAG_LIST
})

export const addNewListName = (newListName) => ({
  type: ADD_NEW_LIST_NAME,
  newListName
})

export const saveTagList = () => ({
  type: SAVE_TAG_LIST
})

export const changeTagStringList = (listName) => ({
  type: CHANGE_TAG_STRING_LIST,
  listName
})

export const editListName = (oldListName, newListName) => ({
  type: EDIT_LIST_NAME,
  oldListName,
  newListName
})

export const editTagString = (listName, oldTagString, newTagString) => ({
  type: EDIT_TAG_STRING,
  listName,
  oldTagString,
  newTagString
})

export const addNewTagString = (listName, tagString) => ({
  type: ADD_NEW_TAG_STRING,
  listName,
  tagString
})

export const deleteListName = (listName) => ({
  type: DELETE_LIST_NAME,
  listName
})

export const deleteTagString = (listName, tagString) => ({
  type: DELETE_TAG_STRING,
  listName,
  tagString
})

export const getFileCount = () => ({
  type: GET_FILE_COUNT
})

export const getLabeledFileCount = () => ({
  type: GET_LABELED_FILE_COUNT
})
