import { ADD_NEW_VIDEO_LABEL, REMOVE_VIDEO_LABEL } from '../actions/video_action';

const initState = {
  videoLabelList: []
}

const videoReducer = (state=initState, action) => {
  const { label, index } = action;
  switch (action.type) {
    case ADD_NEW_VIDEO_LABEL: {
      const newVideoLabelList = state.videoLabelList.concat([label])
      return {
        ...state,
        videoLabelList: newVideoLabelList
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
    default: return state
  }
}

export default videoReducer;
