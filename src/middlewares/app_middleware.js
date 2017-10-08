import { segmentAnnotator } from '../segment_page/SegmentView';

const appMiddleware = store => next => action => {
    if(action.type === 'UPLOAD_IMAGE_FILES') {
        const state = store.getState().appReducer;
        const { files } = action;
        for(const file of files) {
            if(!file.type.match('image.*')) {
                continue;
            }
            const formData = new FormData();
            formData.append("file", file);
            const fileRequest = new XMLHttpRequest();
            fileRequest.open('POST', `${state.defaultURL}uploadfile?usrname=${state.userName}&taskname=${state.taskName}&filename=${file.name}`);
            fileRequest.send(formData);
            fileRequest.onload = function() {
                store.dispatch({
                    type: 'GET_FILE_COUNT'
                })
            }
            fileRequest.onerror = function() {
                console.log('post images failed.');
            }
        }
    }
    else if(action.type === 'GET_IMAGE_LIST') {
        const state = store.getState().appReducer;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${state.defaultURL}getdir?usrname=${state.userName}&taskname=${state.taskName}&start=${state.start}&num=${state.num}`);
        xhr.onload = function() {
            console.log('getImageList success');
            const imageList = [];
            if(xhr.response) {
                const jsonResponse = JSON.parse(xhr.response);
                jsonResponse.map((image) => {
                    imageList.push({url: image.url, name: image.name, labeled: image.labeled});
                })
            }
            next({type: 'GET_IMAGE_LIST', imageList});
        }
        xhr.send();
    }
    else if(action.type === 'SAVE_IMAGE_ANNOTATION') {
        const state = store.getState().appReducer;
        const { index, annotation } = action;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${state.defaultURL}saveseglabel?usrname=${state.userName}&taskname=${state.taskName}&filename=${state.imageList[index].name}`);
        xhr.onload = function() {
            console.log('post seglabel success');
        }
        xhr.setRequestHeader("Content-Type", "text/plain");
        const formData = new FormData();
        formData.append("file", annotation);
        xhr.send(formData);
    }
    else if(action.type === 'GET_IMAGE_ANNOTATION') {
        const state = store.getState().appReducer;
        const { index } = action;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${state.defaultURL}loadseglabel?usrname=${state.userName}&taskname=${state.taskName}&filename=${state.imageList[index].name}`);
        xhr.onload = function() {
            next({
                type: 'GET_IMAGE_ANNOTATION',
                imageAnnotation: xhr.response
            })
        }
        xhr.send();
    }
    else if(action.type === 'SAVE_SEGMENT_ANNOTATOR_LABELS') {
        const { labels } = action;
        const state = store.getState().appReducer;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${state.defaultURL}savetag?usrname=${state.userName}&taskname=${state.taskName}`);
        xhr.onload = function() {

        }
        xhr.setRequestHeader("Content-Type", "text/plain");
        const data = JSON.stringify(labels);
        xhr.send(data);
    }
    else if(action.type === 'GET_SEGMENT_ANNOTATOR_LABELS') {
        const state = store.getState().appReducer;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${state.defaultURL}loadtag?usrname=${state.userName}&taskname=${state.taskName}`);
        xhr.onload = function() {
            const labels = JSON.parse(xhr.response);
            if(labels.length > 0) {
                segmentAnnotator.setLabels(labels);
                next({
                    type: 'GET_SEGMENT_ANNOTATOR_LABELS',
                    segmentAnnotatorLabels: labels
                })
            } else {
                next({
                    type: 'GET_SEGMENT_ANNOTATOR_LABELS',
                    segmentAnnotatorLabels: [
                        {name: 'background', color: [255, 255, 255]}
                    ]
                })
            }
        }
        xhr.send();
    }
    else if(action.type === 'GET_FILE_COUNT') {
        const state = store.getState().appReducer;
        const getFileCount = new XMLHttpRequest();
        getFileCount.open('GET', `${state.defaultURL}filecount?usrname=${state.userName}&taskname=${state.taskName}`);
        getFileCount.send();
        getFileCount.onload = function() {
            const theFileCount = getFileCount.response;
            next({
                type: 'GET_FILE_COUNT',
                fileCount: theFileCount
            })
        }
    }
    else if(action.type === 'GET_TAGGED_FILE_COUNT') {
        const state = store.getState().appReducer;
        const getTagedFileCount = new XMLHttpRequest();
        getTagedFileCount.open('GET', `${state.defaultURL}labeledfilecount?usrname=${state.userName}&taskname=${state.taskName}`);
        getTagedFileCount.send();
        getTagedFileCount.onload = function() {
            const theTaggedFileCount = getTagedFileCount.response;
            next({
                type: 'GET_TAGGED_FILE_COUNT',
                taggedFileCount: theTaggedFileCount
            })
        }
    }
    else if(action.type === 'DELETE_IMAGE') {
        const state = store.getState().appReducer;
        const deleteRequest = new XMLHttpRequest();
        deleteRequest.open('GET', `${state.defaultURL}delfile?usrname=${state.userName}&taskname=${state.taskName}&filename=${state.imageList[state.selectedImageNum].name}`);
        deleteRequest.send();
        next({
            type: 'DELETE_IMAGE'
        })
        store.dispatch({
            type: 'GET_FILE_COUNT'
        })
    } else if(action.type === 'SAVE_HELPER_DOC') {
      const state = store.getState().appReducer;
      const { navList } = action;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${state.defaultURL}savedoc`);
      const data = JSON.stringify({
        request: {
          data: navList
        }
      });
      xhr.send(data);
    } else if(action.type === 'GET_HELPER_DOC') {
      const state = store.getState().appReducer;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${state.defaultURL}loaddoc`);
      xhr.send();
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        next({
          type: 'GET_HELPER_DOC',
          navList: data.request.data
        })
      }
    } else {
        next(action);
    }
}

export default appMiddleware;
