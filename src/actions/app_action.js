import appReducer from '../reducers/app_reducer.js';

export const ADD_NEW_IMAGE = 'ADD_NEW_IMAGE';
export const CLICK_SELECT_BAR_ITEM = 'CLICK_SELECT_BAR_ITEM';
export const ADD_NEW_SEGMENT_ANNOTATOR = 'ADD_NEW_SEGMENT_ANNOTATOR';
export const UPLOAD_IMAGE_FILES = 'UPLOAD_IMAGE_FILES';

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
