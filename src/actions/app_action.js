import appReducer from '../reducers/app_reducer.js';

export const ADD_NEW_IMAGE = 'ADD_NEW_IMAGE';
export const CLICK_SELECT_BAR_ITEM = 'CLICK_SELECT_BAR_ITEM';
export const ADD_NEW_SEGMENT_ANNOTATOR = 'ADD_NEW_SEGMENT_ANNOTATOR';
export const UPLOAD_IMAGE_FILES = 'UPLOAD_IMAGE_FILES';
export const GET_IMAGE_LIST = 'GET_IMAGE_LIST';
export const SAVE_IMAGE_ANNOTATION = 'SAVE_IMAGE_ANNOTATION';
export const GET_IMAGE_ANNOTATION = 'GET_IMAGE_ANNOTATION';
export const SAVE_SEGMENT_ANNOTATOR_LABELS = 'SAVE_SEGMENT_ANNOTATOR_LABELS';
export const GET_SEGMENT_ANNOTATOR_LABELS = 'GET_SEGMENT_ANNOTATOR_LABELS';
export const SET_SEGMENT_ANNOTATOR_LABELS = 'SET_SEGMENT_ANNOTATOR_LABELS';
export const CHANGE_USER_NAME = 'CHANGE_USER_NAME';
export const CHANGE_TASK_NAME = 'CHANGE_TASK_NAME';
export const CHANGE_USER_LEVEL = 'CHANGE_USER_LEVEL';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const INIT_APP_REDUCER_STATE = 'INIT_APP_REDUCER_STATE';
export const GET_FILE_COUNT = 'GET_FILE_COUNT';
export const GET_TAGGED_FILE_COUNT = 'GET_TAGGED_FILE_COUNT';
export const DELETE_IMAGE = 'DELETE_IMAGE';
export const SHOULD_UPDATE_IMAGE = 'SHOULD_UPDATE_IMAGE';
export const CHANGE_START_VALUE = 'CHANGE_START_VALUE';
export const CHANGE_NUM_VALUE = 'CHANGE_NUM_VALUE';
export const SAVE_HELPER_DOC = 'SAVE_HELPER_DOC';
export const GET_HELPER_DOC = 'GET_HELPER_DOC';
export const GET_MANAGER_DATA = 'GET_MANAGER_DATA';
export const GET_TRAIN_STATE_LOG = 'GET_TRAIN_STATE_LOG';

export function addNewImage(imageUrl, imageName) {
    return {
        type: ADD_NEW_IMAGE,
        newImage: {
            name: imageName,
            url: imageUrl
        }
    }
}

export function onClickItem(index) {
    return {
        type: CLICK_SELECT_BAR_ITEM,
        index
    }
}

export function addNewSegmentAnnotator(segmentAnnotator) {
    return {
        type: ADD_NEW_SEGMENT_ANNOTATOR,
        segmentAnnotator
    }
}

export function uploadImageFiles(files) {
    return {
        type: UPLOAD_IMAGE_FILES,
        files
    }
}

export function getImageList() {
    return {
        type: GET_IMAGE_LIST
    }
}

export function saveImageAnnotation(data) {
    return {
        type: SAVE_IMAGE_ANNOTATION,
        index: data.index,
        annotation: data.annotation
    }
}

export function getImageAnnotation(index) {
    return {
        type: GET_IMAGE_ANNOTATION,
        index
    }
}

export function saveSegmentAnnotatorLabels(labels) {
    return {
        type: SAVE_SEGMENT_ANNOTATOR_LABELS,
        labels
    }
}

export function getSegmentAnnotatorLabels() {
    return {
        type: GET_SEGMENT_ANNOTATOR_LABELS,
    }
}

export function setSegmentAnnotatorLabels(newLabels) {
    return {
        type: SET_SEGMENT_ANNOTATOR_LABELS,
        newLabels
    }
}

export const changeUserName = (userName) => ({
    type: CHANGE_USER_NAME,
    userName
})

export const changeTaskName = (taskName) => ({
    type: CHANGE_TASK_NAME,
    taskName
})

export const changeUserLevel = (userLevel) => ({
    type: CHANGE_USER_LEVEL,
    userLevel
})

export const initAppReducerState = () => ({
    type: INIT_APP_REDUCER_STATE
})

export const getFileCount = () => ({
    type: GET_FILE_COUNT
})

export const getTaggedFileCount = () => ({
    type: GET_TAGGED_FILE_COUNT
})

export const deleteImage = () => ({
    type: DELETE_IMAGE
})

export const shouldUpdateImage = () => ({
    type: SHOULD_UPDATE_IMAGE
})

export const changeStartValue = (start) => ({
    type: CHANGE_START_VALUE,
    start
})

export const changeNumValue = (num) => ({
    type: CHANGE_NUM_VALUE,
    num
})

export const saveHelperDoc = (navList) => ({
  type: SAVE_HELPER_DOC,
  navList
})

export const getHelperDoc = () => ({
  type: GET_HELPER_DOC
})

export const changePassword = (password) => ({
  type: CHANGE_PASSWORD,
  password
})

export const getManagerData = () => ({
  type: GET_MANAGER_DATA
})

export const getTrainStateLog = () => ({
  type: GET_TRAIN_STATE_LOG
})
