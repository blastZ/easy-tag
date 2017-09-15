import { ADD_NEW_IMAGE, CLICK_SELECT_BAR_ITEM,
         ADD_NEW_SEGMENT_ANNOTATOR, GET_IMAGE_LIST,
         GET_IMAGE_ANNOTATION, GET_SEGMENT_ANNOTATOR_LABELS,
         SET_SEGMENT_ANNOTATOR_LABELS, CHANGE_USER_NAME,
         CHANGE_TASK_NAME, CHANGE_USER_LEVEL,
         INIT_APP_REDUCER_STATE, GET_FILE_COUNT,
         GET_TAGGED_FILE_COUNT, DELETE_IMAGE,
         SHOULD_UPDATE_IMAGE, CHANGE_START_VALUE,
         CHANGE_NUM_VALUE} from '../actions/app_action';

const initState = {
    defaultURL: 'http://demo.codvision.com:16831/api/',
    userName: 'fj',
    taskName: 'ttt',
    start: 1,
    num: 10,
    fileCount: 0,
    taggedFileCount: 0,
    userLevel: 3,
    imageList: [], //{url: image.url, name: image.name, labeled: image.labeled}
    selectedImageNum: 0,
    segmentAnnotatorList: [], // {labels: [{name: 'bacground', color: [255, 255, 255]}], annotation: "string"}
    imageAnnotation: null,
    segmentAnnotatorLabels: [],
    updateImage: false
}

function appReducer(state=initState, action) {
    const { userName, taskName, newImage,
            index, segmentAnnotator, imageList,
            imageAnnotation, segmentAnnotatorLabels, newLabels,
            userLevel, fileCount, taggedFileCount,
            start, num} = action;
    switch (action.type) {
        case ADD_NEW_IMAGE: {
            return {
                ...state,
                imageList: state.imageList.concat(newImage)
            }
        }
        case CLICK_SELECT_BAR_ITEM: {
            return {
                ...state,
                selectedImageNum: index
            }
        }
        case ADD_NEW_SEGMENT_ANNOTATOR: {
            const newList = state.segmentAnnotatorList;
            const newSegment = {
                labels: segmentAnnotator.labels,
                annotation: segmentAnnotator.annotation
            };
            newList[segmentAnnotator.index] = newSegment;
            return {
                ...state,
                segmentAnnotatorList: newList
            }
        }
        case GET_IMAGE_LIST: {
            return {
                ...state,
                imageList
            }
        }
        case GET_IMAGE_ANNOTATION: {
            return {
                ...state,
                imageAnnotation
            }
        }
        case GET_SEGMENT_ANNOTATOR_LABELS: {
            return {
                ...state,
                segmentAnnotatorLabels
            }
        }
        case SET_SEGMENT_ANNOTATOR_LABELS: {
            return {
                ...state,
                segmentAnnotatorLabels: newLabels
            }
        }
        case CHANGE_USER_NAME: {
            return {
                ...state,
                userName
            }
        }
        case CHANGE_TASK_NAME: {
            return {
                ...state,
                taskName
            }
        }
        case CHANGE_USER_LEVEL: {
            return {
                ...state,
                userLevel
            }
        }
        case INIT_APP_REDUCER_STATE: {
            return {
                ...state,
                taskName: '',
                selectedImageNum: 0,
                imageList: [],
                start: 1,
                num: 10,
                segmentAnnotatorList: [],
                imageAnnotation: null,
                segmentAnnotatorLabels: [],
            }
        }
        case GET_FILE_COUNT: {
            return {
                ...state,
                fileCount
            }
        }
        case GET_TAGGED_FILE_COUNT: {
            return {
                ...state,
                taggedFileCount
            }
        }
        case DELETE_IMAGE: {
            const newImageList = state.imageList;
            newImageList.splice(state.selectedImageNum, 1);
            if(state.selectedImageNum !== 0) {
                return {
                    ...state,
                    imageList: newImageList,
                    selectedImageNum: state.selectedImageNum - 1,
                    updateImage: true
                }
            } else {
                if(state.imageList.length > 0) {
                    return {
                        ...state,
                        imageList: newImageList,
                        selectedImageNum: 0,
                        updateImage: true
                    }
                }
            }
        }
        case SHOULD_UPDATE_IMAGE: {
            return {
                ...state,
                updateImage: !state.updateImage
            }
        }
        case CHANGE_START_VALUE: {
            return {
                ...state,
                start
            }
        }
        case CHANGE_NUM_VALUE: {
            return {
                ...state,
                num
            }
        }
        default: return state;
    }
}

export default appReducer;
