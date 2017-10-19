import { ADD_NEW_VIDEO_LABEL, REMOVE_VIDEO_LABEL, ADD_NEW_VIDEO,
         GET_VIDEO_LABEL, GET_VIDEO_LIST, INIT_STATE, DELETE_VIDEO } from '../actions/video_action';

const initState = {
  videoList: [],
  videoLabelList: []
}

const videoReducer = (state=initState, action) => {
  const { videoList, label, index, file, videoLabelList } = action;
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
    default: return state
  }
}

export default videoReducer;
