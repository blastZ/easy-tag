import { ADD_NEW_IMAGE, CLICK_SELECT_BAR_ITEM,
         ADD_NEW_SEGMENT_ANNOTATOR, GET_IMAGE_LIST,
         GET_IMAGE_ANNOTATION, GET_SEGMENT_ANNOTATOR_LABELS,
         SET_SEGMENT_ANNOTATOR_LABELS, CHANGE_USER_NAME,
         CHANGE_TASK_NAME, CHANGE_USER_LEVEL,
         INIT_APP_REDUCER_STATE, GET_FILE_COUNT,
         GET_TAGGED_FILE_COUNT, DELETE_IMAGE,
         SHOULD_UPDATE_IMAGE, CHANGE_START_VALUE,
         CHANGE_NUM_VALUE, GET_HELPER_DOC, CHANGE_PASSWORD,
         GET_MANAGER_DATA, GET_TRAIN_STATE_LOG, INIT_TAG_SELECTOR } from '../actions/app_action';
import { DEFAULT_URL } from '../utils/global_config';

const initState = {
    defaultURL: DEFAULT_URL,
    userName: '',
    password: '',
    taskName: '',
    start: 1,
    num: 10,
    fileCount: 0,
    taggedFileCount: 0,
    userLevel: -1,
    imageList: [], //{url: image.url, name: image.name, labeled: image.labeled}
    selectedImageNum: 0,
    segmentAnnotatorList: [], // {labels: [{name: 'bacground', color: [255, 255, 255]}], annotation: "string"}
    imageAnnotation: null,
    segmentAnnotatorLabels: [],
    updateImage: false,
    navList: [],
    managerData: '',
    trainStateLog: '', //app_middleware:172
    regionSize: 40,
    showImageMode: 'LABELED',
    tagSelector: {
      listNameList: [], // 'tagname','tagname2'
      tagStringList: [], // '1','2','3'
      tagStringListAll: {}, // {tagname: ['1','2','3'], tagname2: ['4','5','6']}
      currentList: '',
      currentTag: '',
    }
}

function appReducer(state=initState, action) {
    const { userName, taskName, newImage, index, segmentAnnotator,
            imageList, imageAnnotation, segmentAnnotatorLabels, newLabels,
            userLevel, fileCount, taggedFileCount, start, num, navList,
            password, trainStateLog, regionSize, tagSelector } = action;

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
                imageAnnotation,
                regionSize
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
        case GET_HELPER_DOC: {
          return {
            ...state,
            navList
          }
        }
        case CHANGE_PASSWORD: {
          return {
            ...state,
            password
          }
        }
        case GET_MANAGER_DATA: {
          let data = {
              name: state.userName,
              passwd: state.password
          }
          data = JSON.stringify(data);
          return {
            ...state,
            managerData: data
          }
        }
        case GET_TRAIN_STATE_LOG: {
          return {
            ...state,
            trainStateLog
          }
        }
        case INIT_TAG_SELECTOR: {
          return {
            ...state,
            tagSelector: {
              ...state.tagSelector,
              ...tagSelector
            }
          }
        }
        default: return state;
    }
}

export default appReducer;
