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
    next(action);
}

export default appMiddleware;
