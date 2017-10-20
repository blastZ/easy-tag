import { ADD_NEW_VIDEO_LABEL, REMOVE_VIDEO_LABEL, ADD_NEW_VIDEO,
         GET_VIDEO_LABEL, GET_VIDEO_LIST, INIT_STATE, DELETE_VIDEO,
         GET_TAG_LIST, ADD_NEW_LIST_NAME, CHANGE_TAG_STRING_LIST,
         EDIT_LIST_NAME, EDIT_TAG_STRING, ADD_NEW_TAG_STRING,
         DELETE_LIST_NAME, DELETE_TAG_STRING } from '../actions/video_action';

const initState = {
  videoList: [],
  videoLabelList: [],
  listNameList: [],
  tagList: {},
  tagStringList: [],
}

const videoReducer = (state=initState, action) => {
  const { videoList, label, index, file, videoLabelList, listNameList, tagList, tagStringList,
          newListName, listName, oldListName, oldTagString, newTagString, tagString } = action;
  switch (action.type) {
    case GET_VIDEO_LIST: {
      return {
        ...state,
        videoList
      }
    }
    case ADD_NEW_VIDEO_LABEL: {
      return {
        ...state,
        videoLabelList: state.videoLabelList.concat([label])
      }
    }
    case REMOVE_VIDEO_LABEL: {
      const newVideoLabelList = state.videoLabelList.reduce((accumulator, label, currentIndex) => {
        if(currentIndex !== index) {
          return accumulator.concat([label]);
        } else {
          return accumulator;
        }
      }, [])
      return {
        ...state,
        videoLabelList: newVideoLabelList
      }
    }
    case ADD_NEW_VIDEO: {
      return {
        ...state,
        videoList: state.videoList.concat([{name: file.name, url: URL.createObjectURL(file)}])
      }
    }
    case GET_VIDEO_LABEL: {
      return {
        ...state,
        videoLabelList
      }
    }
    case INIT_STATE: {
      return {
        ...state,
        videoLabelList: []
      }
    }
    case DELETE_VIDEO: {
      const newVideoList = state.videoList.reduce((accumulator, video, currentIndex) => {
        if(currentIndex !== index) {
          return accumulator.concat([video])
        } else {
          return accumulator;
        }
      }, [])
      return {
        ...state,
        videoList: newVideoList
      }
    }
    case GET_TAG_LIST: {
      return {
        ...state,
        listNameList,
        tagList,
        tagStringList
      }
    }
    case ADD_NEW_LIST_NAME: {
      return {
        ...state,
        listNameList: state.listNameList.concat([newListName]),
        tagList: {
          ...state.tagList,
          [newListName]: ['None']
        }
      }
    }
    case CHANGE_TAG_STRING_LIST: {
      return {
        ...state,
        tagStringList: state.tagList[listName]
      }
    }
    case EDIT_LIST_NAME: {
      const index = state.listNameList.indexOf(oldListName);
      const newListNameList = state.listNameList.reduce((accumulator, name, currentIndex) => {
        if(currentIndex === index) {
          return accumulator.concat([newListName])
        } else {
          return accumulator.concat([name])
        }
      }, [])
      const newTagList = {
        ...state.tagList,
        [newListName]: state.tagList[oldListName]
      }
      delete newTagList[oldListName];
      return {
        ...state,
        listNameList: newListNameList,
        tagList: newTagList
      }
    }
    case EDIT_TAG_STRING: {
      const newTagStringList = state.tagStringList.reduce((accumulator, tagString) => {
          if(tagString === oldTagString) {
              return accumulator.concat([newTagString]);
          } else {
              return accumulator.concat([tagString]);
          }
      }, []);
      return {
        ...state,
        tagList: {
          ...state.tagList,
          [listName]: newTagStringList
        },
        tagStringList: newTagStringList
      }
    }
    case ADD_NEW_TAG_STRING: {
      return {
        ...state,
        tagList: {
          ...state.tagList,
          [listName]: state.tagStringList.concat([tagString])
        },
        tagStringList: state.tagStringList.concat([tagString])
      }
    }
    case DELETE_LIST_NAME: {
      const newTagList = state.tagList;
      delete newTagList[listName];
      const newListNameList = state.listNameList.reduce((accumulator, list) => {
        if(list === listName) {
          return accumulator;
        } else {
          return accumulator.concat([list])
        }
      }, []);
      return {
        ...state,
        listNameList: newListNameList,
        tagList: newTagList,
        tagStringList: newTagList[newListNameList[0]]
      }
    }
    case DELETE_TAG_STRING: {
      const newTagStringList = state.tagStringList.reduce((accumulator, tag) => {
        if(tagString === tag) {
          return accumulator;
        } else {
          return accumulator.concat([tag]);
        }
      }, []);
      const newTagList = state.tagList;
      newTagList[listName] = newTagStringList;
      return {
        ...state,
        tagList: newTagList,
        tagStringList: newTagStringList
      }
    }
    default: return state
  }
}

export default videoReducer;
