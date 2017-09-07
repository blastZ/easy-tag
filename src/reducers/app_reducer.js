import { ADD_NEW_IMAGE, CLICK_SELECT_BAR_ITEM, ADD_NEW_SEGMENT_ANNOTATOR } from '../actions/app_action';

const initState = {
    userLevel: 3,
    imageList: [],
    selectedImageNum: 0,
    segmentAnnotatorList: [] // {labels: [{name: 'bacground', color: [255, 255, 255]}], annotation: "string"}
}

function appReducer(state=initState, action) {
    const { newImage, index, segmentAnnotator } = action;
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
            let newList = state.segmentAnnotatorList;
            newList[state.selectedImageNum] = segmentAnnotator;
            return {
                ...state,
                segmentAnnotatorList: newList
            }
        }
        default: return state;
    }
}

export default appReducer;
