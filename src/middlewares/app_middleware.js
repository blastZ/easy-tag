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
                console.log('post images success')
            }
            fileRequest.onerror = function() {
                console.log('post images failed.');
            }
        }
    }
    if(action.type === 'GET_IMAGE_LIST') {
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

    if(action.type === 'SAVE_IMAGE_ANNOTATION') {
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
    if(action.type === 'GET_IMAGE_ANNOTATION') {
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
    if(action.type === 'SAVE_SEGMENT_ANNOTATOR_LABELS') {
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
    if(action.type === 'GET_SEGMENT_ANNOTATOR_LABELS') {
        const state = store.getState().appReducer;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${state.defaultURL}loadtag?usrname=${state.userName}&taskname=${state.taskName}`);
        xhr.onload = function() {
            next({
                type: 'GET_SEGMENT_ANNOTATOR_LABELS',
                segmentAnnotatorLabels: JSON.parse(xhr.response)
            })
        }
        xhr.send();
    }
    next(action);
}

export default appMiddleware;
