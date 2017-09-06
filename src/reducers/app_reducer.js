import { ADD_NEW_IMAGE, CLICK_SELECT_BAR_ITEM } from '../actions/app_action';

const initState = {
    userLevel: 3,
    imageList: [],
    selectedImageNum: 0
}

function appReducer(state=initState, action) {
    const { newImage, index } = action;
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
        default: return state;
    }
}

export default appReducer;
