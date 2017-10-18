export const ADD_NEW_VIDEO_LABEL = 'ADD_NEW_VIDEO_LABEL';
export const REMOVE_VIDEO_LABEL = 'REMOVE_VIDEO_LABEL';

export const addNewVideoLabel = (label) => ({
  type: ADD_NEW_VIDEO_LABEL,
  label
})

export const removeVideoLabel = (index) => ({
  type: REMOVE_VIDEO_LABEL,
  index
})
