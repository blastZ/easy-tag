export const defaultURL = 'http://demo.codvision.com:16831/api/';

export function getTaskStateName(taskStateID) {
    taskStateID = parseInt(taskStateID);
    switch (taskStateID) {
        case 0:
            return ('标注中');
        case 1:
            return ('待训练');
        case 2:
            return ('训练中');
        case 3:
            return ('训练完成');
        case 4:
            return ('出错');
    }
}

export function getTaskTypeName(taskTypeID) {
    taskTypeID = parseInt(taskTypeID);
    switch (taskTypeID) {
        case 0:
            return ('物体检测');
        case 1:
            return ('图片分类');
        case 2:
            return ('视频分类');
    }
}

export function getTaskTypeCode(str) {
    switch (str) {
        case '物体检测': return 0;
        case '图片分类': return 1;
        default: return 0;
    }
}

export  function getUserLevelCode(str) {
    let userLevel = -1;
    switch(str) {
        case '普通用户': userLevel = 0; break;
        case '编辑用户': userLevel = 1; break;
        case '管理用户': userLevel = 2; break;
        case '超级用户': userLevel = 3; break;
    }
    return userLevel;
}
