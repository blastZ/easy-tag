import { CREATE_OBJECT, CHANGE_OBJECT_INDEX, SET_OBJECTS, REMOVE_OBJECT, ADD_TAG, REMOVE_TAG } from './daub_action.js';

const initState = {
  objects: [],
  objectIndex: 0
}

const daubReducer = (state=initState, action) => {
  const { color, tag, index, objects, index2 } = action;
  switch (action.type) {
    case CREATE_OBJECT: {
      return {
        ...state,
        objects: [
          ...state.objects,
          {
            color,
            tagList: [tag]
          }
        ]
      }
    }
    case CHANGE_OBJECT_INDEX: {
      return {
        ...state,
        objectIndex: index
      }
    }
    case SET_OBJECTS: {
      return {
        ...state,
        objects
      }
    }
    case REMOVE_OBJECT: {
      return {
        ...state,
        objects: state.objects.filter((object, theIndex) => (theIndex !== index))
      }
    }
    case ADD_TAG: {
      return {
        ...state,
        objects: state.objects.reduce((accumulator, object, theIndex) => {
          if(theIndex === index) {
            return accumulator.concat([{
              ...object,
              tagList: [
                ...object.tagList,
                tag
              ]
            }])
          } else {
            return accumulator.concat([object]);
          }
        }, [])
      }
    }
    case REMOVE_TAG: {
      return {
        ...state,
        objects: state.objects.reduce((accumulator, object, theIndex) => {
          if(theIndex === index) {
            return accumulator.concat([{
              ...object,
              tagList: object.tagList.filter((tag, theIndex) => (theIndex !== index2))
            }])
          } else {
            return accumulator.concat([object]);
          }
        }, [])
      }
    }
    default:  return state;
  }
}

export default daubReducer;
