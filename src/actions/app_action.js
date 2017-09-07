export const ADD_NEW_IMAGE = 'ADD_NEW_IMAGE';
export const CLICK_SELECT_BAR_ITEM = 'CLICK_SELECT_BAR_ITEM';
export const ADD_NEW_SEGMENT_ANNOTATOR = 'ADD_NEW_SEGMENT_ANNOTATOR';

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
