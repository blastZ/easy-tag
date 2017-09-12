import { ADD_NEW_IMAGE, CLICK_SELECT_BAR_ITEM, ADD_NEW_SEGMENT_ANNOTATOR, GET_IMAGE_LIST, GET_IMAGE_ANNOTATION, GET_SEGMENT_ANNOTATOR_LABELS } from '../actions/app_action';

const initState = {
    defaultURL: 'http://demo.codvision.com:16831/api/',
    userName: 'fj',
    taskName: 'aaa',
    start: 1,
    num: 10,
    userLevel: 3,
    imageList: [],
    selectedImageNum: 0,
    segmentAnnotatorList: [], // {labels: [{name: 'bacground', color: [255, 255, 255]}], annotation: "string"}
    imageAnnotation: null,
    segmentAnnotatorLabels: [],
}

function appReducer(state=initState, action) {
    const { newImage, index, segmentAnnotator, imageList, imageAnnotation, segmentAnnotatorLabels } = action;
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
        default: return state;
    }
}

export default appReducer;
