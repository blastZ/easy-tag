export const CREATE_OBJECT = 'CREATE_OBJECT';
export const CHANGE_OBJECT_INDEX = 'CHANGE_OBJECT_INDEX';
export const SET_OBJECTS = 'SET_OBJECTS';
export const REMOVE_OBJECT = 'REMOVE_OBJECT';
export const ADD_TAG = 'ADD_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';

export const createObject = (color, tag) => ({
  type: CREATE_OBJECT,
  color,
  tag
})

export const changeObjectIndex = (index) => ({
  type: CHANGE_OBJECT_INDEX,
  index
})

export const setObjects = (objects) => ({
  type: SET_OBJECTS,
  objects
})

export const removeObject = (index) => ({
  type: REMOVE_OBJECT,
  index
})

export const addTag = (index, tag) => ({
  type: ADD_TAG,
  index,
  tag
})

export const removeTag = (index, index2) => ({
  type: REMOVE_TAG,
  index,
  index2
})
