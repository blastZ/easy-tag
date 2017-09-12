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
