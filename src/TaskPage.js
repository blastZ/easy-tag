import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class TaskPage extends Component {
    state = {
        taskList: [], //taskName: 'a', time: '2017-07-28 14:42:19', progress: '0.0', tagProgress: '1000/1000', taskState: '1', taskType: '1'
        workerList: [], //workerName: 'a', workerState: '0', taskName: 'a', GPU: '2048/8192', updateTime: '2017-07-02 09:43:12'
        distredUserList: [], //userName: 'aaa', userLevel: '0'
        distrableUserList: [], //userName: 'aaa', userLevel: '0'
        userManageList: [], //userName: 'aaa', email: 'aa@aa.com', activeState: '0', userLevel: '0', userGroup: 'common'
        userGroupList: [], // 'common', 'test'
        tagStatisticsList: [], //tagName: 'aa', tagNum: '11'
        newTaskName: '',
        showInputView: false,
        showImageView: false,
        showPersonPanel: false,
        showDistributeTaskView: false,
        showStartAndNumInputView: false,
        showLabelStatisticsView: false,
        showUserManageEditView: false,
        currentTaskName: '',
        destination: '/tag',
        currentUserName: '',
        start: '',
        num: '',
        currentTaskFileCount: '0',
        currentProgress: '',
        currentTagProgress: '',
        editState: {
            userName: '',
            email: '',
            userLevel: '',
            userGroup: '',
            password: '',
            rePassword: ''
        }
    }

    shouldShowLabelStatisticsView = () => {
        this.setState({showLabelStatisticsView: !this.state.showLabelStatisticsView});
    }

    shouldShowUserManageEditView = (index) => {
        if(typeof(index) !== 'number') {
            this.setState({showUserManageEditView: !this.state.showUserManageEditView, editUserIndex: -1});
        } else {
            const { userName, email, userLevel, userGroup } = this.state.userManageList[index];
            this.setState({showUserManageEditView: !this.state.showUserManageEditView, editUserIndex: index, editState: {
                ... this.state.editState,
                userName,
                email,
                userLevel,
                userGroup
            }});
        }

    }

    handleEditEmail = (e) => {
        this.setState({editState: {
            ...this.state.editState,
            email: e.target.value
        }})
    }

    handleEditUserLevel = (e) => {
        const userLevel = this.getUserLevelCode(e.target.value);
        this.setState({editState: {
            ...this.state.editState,
            userLevel
        }})
    }

    handleEditUserGroup = (e) => {
        this.setState({editState: {
            ...this.state.editState,
            userGroup: e.target.value
        }})
    }

    handleEditPassword = (e) => {
        this.setState({editState: {
            ...this.state.editState,
            password: e.target.value
        }})
    }

    handleEditRePassword = (e) => {
        this.setState({editState: {
            ...this.state.editState,
            rePassword: e.target.value
        }})
    }

    componentDidMount() {
        const that = this;
        const getTaskList = new XMLHttpRequest();
        const getWorkerList = new XMLHttpRequest();
        if(this.props.userLevel === 3) {
            this.getUserManageList();
            this.getUserGroupList();
        }
        try {
            getTaskList.open('GET', `${this.props.defaultURL}gettasklist?usrname=${this.props.username}`);
            getTaskList.send();
            getTaskList.onload = function() {
                const arrayData = that.getArrayData(getTaskList.response);
                that.addTask(arrayData);
            }
        } catch(error) {
            console.log(error);
        }

        try {
            getWorkerList.open('GET', `${this.props.defaultURL}getworkerlist?usrname=${this.props.username}`);
            getWorkerList.send();
            getWorkerList.onload = function() {
                const arrayData = that.getArrayData(getWorkerList.response);
                if(that.refs.theWorkerTable) {
                    that.addWorker(arrayData);
                }
            }
        } catch(error) {
            console.log(error);
        }

        window.setInterval(this.refreshInterval, 60000);
    }

    refreshInterval = () => {
        this.refreshTaskPage();
    }

    componentWillUnmount() {
        window.clearInterval(this.refreshInterval);
    }

    getManagerData = () => {
        let data = {
            name: this.props.username,
            passwd: this.props.password
        }
        data = JSON.stringify(data);
        return data;
    }

    getUserManageList = () => {
        const that = this;
        try {
            const request = new XMLHttpRequest();
            request.open('POST', `${this.props.defaultURL}getuserlist`);
            const data = this.getManagerData();
            request.send(data);
            request.onload = function() {
                console.log('get userManageList success');
                that.getFormatUserManageList(request.response);
            }
        } catch(error) {
            console.log(error);
        }
    }

    getUserGroupList = () => {
        const that = this;
        try {
            const request = new XMLHttpRequest();
            request.open('GET', `${this.props.defaultURL}getgrouplist`);
            request.send();
            request.onload = function() {
                console.log('get userGroupList success');
                that.getFormatUserGroupList(request.response);
            }
        } catch(error) {
            console.log(error);
        }
    }

    getFormatUserGroupList = (str) => {
        const userGroupList = [];
        const arrayData = str.split(',');
        if(arrayData.length > 0) {
            for(let i=0; i<arrayData.length; i++) {
                let groupName = '';
                if(i === arrayData.length - 1) {
                    groupName = arrayData[i].slice(3, arrayData[i].length - 2);
                } else {
                    groupName = arrayData[i].slice(3, arrayData[i].length - 1);
                }
                userGroupList.push(groupName)
            }
            this.setState({userGroupList});
        }
    }

    getFormatUserManageList = (str) => {
        const userManageList = [];
        const arrayData = str.split(',');
        if(arrayData.length > 3) {
            for(let i=0; i<arrayData.length; i=i+5) {
                const userName = arrayData[i].slice(3, arrayData[i].length - 1);
                const email = arrayData[i + 1].slice(2, arrayData[i + 1].length - 1);
                const activeState = arrayData[i + 2].slice(1, 2);
                const userLevel = arrayData[i + 3].slice(1, 2);
                let userGroup = '';
                if((i + 4) === arrayData.length - 1) {
                    userGroup = arrayData[i + 4].slice(3, arrayData[i + 4].length - 3);
                } else {
                    userGroup = arrayData[i + 4].slice(3, arrayData[i + 4].length - 2);
                }
                userManageList.push({
                    userName,
                    email,
                    activeState,
                    userLevel,
                    userGroup
                })
            }
            this.setState({userManageList});
        }
    }

    popupInputView = () => {
        this.setState({showInputView: true});
    }

    closeInputView = () => {
        this.setState({
            showInputView: false,
            newTaskName: ''
        });
    }

    closeImageView = () => {
        this.setState({showImageView: false});
    }

    getTaskTypeCode = (str) => {
        switch (str) {
            case '物体检测': return 0;
            case '图片分类': return 1;
            default: return 0;
        }
    }

    onAddTask = () => {
        const that = this;
        const result = /^[a-zA-Z0-9]+$/.test(this.state.newTaskName);
        if(result === false) {
            window.alert('请输入正确的任务名');
        } else {
            const getNewTask = new XMLHttpRequest();
            try {
                const type = document.getElementById('newTaskType').value;
                getNewTask.open('GET', `${this.props.defaultURL}addtask?usrname=${this.props.username}&taskname=${this.state.newTaskName}&type=${this.getTaskTypeCode(type)}`);
                getNewTask.send();
                getNewTask.onload = function() {
                    const arrayData = that.getArrayData(getNewTask.response);
                    console.log(arrayData);
                    that.addTask(arrayData);
                    that.setState({
                        newTaskName: ''
                    })
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    addTask = (arrayData) => {
        if(arrayData.length > 4) {
            this.setState({showInputView: false});
            const newTaskList = [];
            for(let i=0; i<arrayData.length; i=i+5) {
                const  taskName = arrayData[i].slice(4, arrayData[i].length - 1);
                const time = arrayData[i + 1].slice(3, 22);
                const progress = arrayData[i + 2].slice(1,arrayData[i + 2].length);
                const taskState = arrayData[i + 3].slice(1, 2);
                const taskType = arrayData[i + 4].slice(1, 2);
                newTaskList.push({taskName: taskName, time: time,tagProgress: '0/0', progress: progress, taskState: taskState, taskType: taskType});
            }
            if(this.refs.theTaskTable) {
                this.setState({taskList: newTaskList});
            }
        }
    }

    getTagProgress = (taskName, showLabelStatistics) => {
        const that = this;
        const getFileCount = new XMLHttpRequest();
        getFileCount.open('GET', `${this.props.defaultURL}filecount?usrname=${this.props.username}&taskname=${taskName}`);
        getFileCount.send();
        getFileCount.onload = function() {
            console.log('getFileCount success.');
            const theFileCount = getFileCount.response;
            const getTagedFileCount = new XMLHttpRequest();
            getTagedFileCount.open('GET', `${that.props.defaultURL}labeledfilecount?usrname=${that.props.username}&taskname=${taskName}`);
            getTagedFileCount.send();
            getTagedFileCount.onload = function() {
                const theTagedFileCount = getTagedFileCount.response;
                const tagProgress = `${theTagedFileCount}/${theFileCount}`;
                if(that.refs.theTaskTable) {
                    that.setState((state) => {
                        state.taskList.map((task) => {
                            if(task.taskName === taskName) {
                                task.tagProgress = tagProgress;
                            }
                        })
                    }, function() {
                        showLabelStatistics();
                    })
                }
            }
        }
    }

    addWorker = (arrayData) => {
        if(arrayData.length > 4) {
            const newWorkerList = [];
            for(let i=0; i<arrayData.length; i=i+5) {
                const workerName = arrayData[i].slice(4, arrayData[i].length - 1);
                const workerState = arrayData[i + 1].slice(1, 2);
                const taskName = arrayData[i + 2].slice(3, arrayData[i + 2].length - 1);
                const GPU = arrayData[i + 3].slice(3, arrayData[i + 3].length - 1);
                const updateTime = arrayData[i + 4].slice(3, 22);
                newWorkerList.push({workerName: workerName, workerState: workerState, GPU: GPU, taskName: taskName, updateTime: updateTime});
            }
            if(this.refs.theWorkerTable) {
                this.setState({workerList: newWorkerList});
            }
        } else {
            this.setState({workerList: []});
        }
    }

    getArrayData = (data) => {
        data = data.split(',');
        return data;
    }

    handleInputChange = (e) => {
        this.setState({newTaskName: e.target.value})
    }

    onLookTrainState = (index) => {
        const that = this;
        const taskState = this.state.taskList[index].taskState;
        const currentProgress = this.state.taskList[index].progress;
        if(taskState === '2' || taskState === '3') {
            try {
                const lookTrainState = new XMLHttpRequest();
                lookTrainState.open('GET', `${this.props.defaultURL}taskinfo?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`);
                lookTrainState.send();
                lookTrainState.onload = function() {
                    that.setState({showImageView: true, currentProgress}, function() {
                        document.getElementById('train-state').src = lookTrainState.response;
                    })
                }
            } catch(error) {
                console.log(error);
            }
        } else {

        }
    }

    verifyTagProgress = (index) => {
        const that = this;
        this.getTagProgress(this.state.taskList[index].taskName, function(){
            const str = that.state.taskList[index].tagProgress;
            const numStr = str.split('/');
            const tagedImageNum = parseInt(numStr[0]);
            const AllImageNum = parseInt(numStr[1]);
            console.log(tagedImageNum);
            console.log(AllImageNum);
            if(tagedImageNum < 500 || (tagedImageNum / AllImageNum) < 0.5) {
                window.alert('标注图片数量不足');
            } else {
                const taskState = that.state.taskList[index].taskState;
                if(taskState === '0') {
                    try {
                        const startTask = new XMLHttpRequest();
                        startTask.open('GET', `${that.props.defaultURL}starttask?usrname=${that.props.username}&taskname=${that.state.taskList[index].taskName}`);
                        startTask.send();
                        startTask.onload = function() {
                            const arrayData = that.getArrayData(startTask.response);
                            that.addTask(arrayData);
                        }
                    } catch(error) {
                        console.log(error);
                    }
                } else if(taskState === '3') {
                    const result = window.confirm('确定重新训练吗?');
                    if(result) {
                        try {
                            const startTask = new XMLHttpRequest();
                            startTask.open('GET', `${that.props.defaultURL}starttask?usrname=${that.props.username}&taskname=${that.state.taskList[index].taskName}`);
                            startTask.send();
                            startTask.onload = function() {
                                const arrayData = that.getArrayData(startTask.response);
                                that.addTask(arrayData);
                            }
                        } catch(error) {
                            console.log(error);
                        }
                    }
                }
            }
        });
    }

    onStartTask = (index) => {
        this.verifyTagProgress(index);
    }

    onStopTask = (index) => {
        const that = this;
        const taskState = this.state.taskList[index].taskState;
        if(taskState === '1' || taskState === '2') {
            const result = window.confirm('确定停止训练吗?');
            if(result) {
                try {
                    const startTask = new XMLHttpRequest();
                    startTask.open('GET', `${this.props.defaultURL}stoptask?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`);
                    startTask.send();
                    startTask.onload = function() {
                        const arrayData = that.getArrayData(startTask.response);
                        that.addTask(arrayData);
                    }
                } catch(error) {
                    console.log(error);
                }
            }
        } else {

        }
    }

    onDeleteTask = (index) => {
        const result = window.confirm('确定删除该任务吗?');
        if(result) {
            const that = this;
            try {
                const deleteTask = new XMLHttpRequest();
                deleteTask.open('GET', `${this.props.defaultURL}deltask?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`);
                deleteTask.send();
                deleteTask.onload = function() {
                    const arrayData = that.getArrayData(deleteTask.response);
                    that.addTask(arrayData);
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    onLinkToTag = (index) => {
        this.props.onChangeUserAndTask(this.props.username, this.state.taskList[index].taskName);
        this.props.onInitStartAndNum();
    }

    onLinkToTest = (index) => {
        if(this.state.taskList[index].taskState === '3') {
            this.props.onChangeUserAndTask(this.props.username, this.state.taskList[index].taskName);
        }
    }

    getTaskStateName = (taskStateID) => {
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

    getTaskTypeName = (taskTypeID) => {
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

    getWorkerStateName = (workerStateID) => {
        workerStateID = parseInt(workerStateID);
        switch (workerStateID) {
            case 0:
                return ('空闲');
            case 1:
                return ('忙碌');
            case 2:
                return ('掉线');
        }
    }

    showPersonPanel = () => {
        this.setState({showPersonPanel: true});
    }

    closePersonPanel = () => {
        this.setState({showPersonPanel: false});
    }

    refreshTaskPage = () => {
        const that = this;
        const getTaskList = new XMLHttpRequest();
        const getWorkerList = new XMLHttpRequest();
        try {
            getTaskList.open('GET', `${this.props.defaultURL}gettasklist?usrname=${this.props.username}`);
            getTaskList.send();
            getTaskList.onload = function() {
                const arrayData = that.getArrayData(getTaskList.response);
                that.addTask(arrayData);
            }
        } catch(error) {
            console.log(error);
        }

        try {
            getWorkerList.open('GET', `${this.props.defaultURL}getworkerlist?usrname=${this.props.username}`);
            getWorkerList.send();
            getWorkerList.onload = function() {
                const arrayData = that.getArrayData(getWorkerList.response);
                that.addWorker(arrayData);
            }
        } catch(error) {
            console.log(error);
        }
        if(this.props.userLevel === 3) {
            this.getUserManageList();
            this.getUserGroupList();
        }
    }

    showDistributeTaskView = (index) => {
        this.setState({showDistributeTaskView: true});
        this.setState({currentTaskName: this.state.taskList[index].taskName}, function() {
            this.getDistredUserList(this.state.currentTaskName);
            this.getDistrableUserList();
            const that = this;
            const getFileCount = new XMLHttpRequest();
            getFileCount.open('GET', `${this.props.defaultURL}filecount?usrname=${this.props.username}&taskname=${this.state.currentTaskName}`);
            getFileCount.send();
            getFileCount.onload = function() {
                that.setState({currentTaskFileCount: getFileCount.response});
            }
        })
    }

    distributeTaskToUser = (index) => {
        const userName = this.state.distrableUserList[index].userName;
        this.setState({showStartAndNumInputView: true, currentUserName: userName});
    }

    confirmDistrTaskToUser = () => {
        const start = this.state.start;
        const num = this.state.num;
        const fileCount = parseInt(this.state.currentTaskFileCount);
        if((start + num - 1) > fileCount) {
            window.alert(`总共 ${fileCount} 张,请检查输入`);
        } else if(start === '' || num === '') {
            window.alert('起始序号或图片数量不能为空');
        } else {
            const that = this;
            try{
                const request = new XMLHttpRequest();
                request.open('GET', `${this.props.defaultURL}distributetask?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&distusrname=${this.state.currentUserName}&start=${this.state.start}&num=${this.state.num}`);
                request.send();
                request.onload = function() {
                    that.getDistredUserList(that.state.currentTaskName);
                    that.getDistrableUserList();
                    that.setState({
                        start: '',
                        num: '',
                        currentUserName: '',
                    })
                }
            } catch(error) {
                console.log(error);
            }
            this.closeStartAndNumInputView();
        }
    }

    unDistributeTaskToUser = (index) => {
        const userName = this.state.distredUserList[index].userName;
        const that = this;
        try{
            const request = new XMLHttpRequest();
            request.open('GET', `${this.props.defaultURL}undistributetask?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&distusrname=${userName}`);
            request.send();
            request.onload = function() {
                that.getDistredUserList(that.state.currentTaskName);
                that.getDistrableUserList();
            }
        } catch(error) {
            console.log(error);
        }
    }

    getUserLevelName = (userLevel) => {
        userLevel = parseInt(userLevel);
        switch (userLevel) {
            case 0: return '普通用户';
            case 1: return '编辑用户';
            case 2: return '管理用户';
            case 3: return '超级用户';
            default: return 'ERROR';
        }
    }

    closeDistributeTaskView = () => {
        this.setState({showDistributeTaskView: false});
    }

    closeStartAndNumInputView = () => {
        this.setState({
            showStartAndNumInputView: false,
            start: '',
            num: '',
            currentUserName: ''
        });
    }

    getDistredUserList = (taskName) => {
        const that = this;
        try{
            const request = new XMLHttpRequest();
            request.open('GET', `${this.props.defaultURL}distreduserlist?usrname=${this.props.username}&taskname=${taskName}`);
            request.send();
            request.onload = function() {
                const distredUserList = that.getFormatUserList(request.response);
                that.setState({distredUserList});
            }
        } catch(error) {
            console.log(error);
        }
    }

    getDistrableUserList = () => {
        const that = this;
        try{
            const request = new XMLHttpRequest();
            request.open('GET', `${this.props.defaultURL}distrableuserlist?usrname=${this.props.username}`);
            request.send();
            request.onload = function() {
                const distrableUserList = that.getFormatUserList(request.response);
                that.setState({distrableUserList});
            }
        } catch(error) {
            console.log(error);
        }
    }

    getFormatUserList = (str) => {
        const arrayData = str.split(',');
        const distredUserList = [];
        if(arrayData.length > 1) {
            for(var i=0; i<arrayData.length; i=i+2) {
                const userName = arrayData[i].slice(3, arrayData[i].length - 1);
                const userLevel = arrayData[i + 1].slice(1, 2);
                distredUserList.push({userName, userLevel});
            }
        }
        return distredUserList;
    }

    handleStartInputChange = (e) => {
        let start = parseInt(e.target.value);
        const fileCount = parseInt(this.state.currentTaskFileCount);
        if(start < 1) {
            start = 1;
        }
        if(start > fileCount) {
            start = fileCount;
        }
        this.setState({start: start});
    }

    handleNumInputChange = (e) => {
        let num = parseInt(e.target.value);
        const fileCount = parseInt(this.state.currentTaskFileCount);
        if(num < 1) {
            num = 1;
        }
        if(num > fileCount) {
            num = fileCount;
        }
        this.setState({num: num});
    }

    deleteUser = (index) => {
        const that = this;
        const result = window.confirm("确定删除该用户吗?");
        if(result) {
            try{
                const request = new XMLHttpRequest();
                request.open('POST', `${this.props.defaultURL}delusr?usrname=${this.state.userManageList[index].userName}`);
                const data = this.getManagerData();
                request.send(data);
                request.onload = function() {
                    that.getUserManageList();
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    getUserLevelCode = (str) => {
        let userLevel = -1;
        switch(str) {
            case '普通用户': userLevel = 0; break;
            case '编辑用户': userLevel = 1; break;
            case '管理用户': userLevel = 2; break;
            case '超级用户': userLevel = 3; break;
        }
        return userLevel;
    }

    saveEditResult = () => {
        const that = this;
        const { defaultURL } = this.props;
        const { userName, userLevel, email, userGroup, password, rePassword } = this.state.editState;
        let closeWindow = true;
        try{
            const userLevelRequest = new XMLHttpRequest();
            const emailRequest = new XMLHttpRequest();
            const userGroupRequest = new XMLHttpRequest();
            const passwordRequest = new XMLHttpRequest();
            userLevelRequest.open('POST', `${defaultURL}setusrlevel?usrname=${userName}&level=${userLevel}`);
            userGroupRequest.open('POST', `${defaultURL}setusrgroup?usrname=${userName}&group=${userGroup}`);
            emailRequest.open('POST', `${defaultURL}setusremail?usrname=${userName}&email=${email}`);
            passwordRequest.open('POST', `${defaultURL}setusrpasswd?usrname=${userName}&passwd=${password}`);
            const data = this.getManagerData();
            userLevelRequest.send(data);
            userGroupRequest.send(data);
            if(email !== '') {
                if(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                    emailRequest.send(data);
                    emailRequest.onload = function() {
                        that.getUserManageList();
                    }
                } else {
                    window.alert('请输入正确的邮箱地址');
                    closeWindow = false;
                }
            }
            if(password !== '' && password === rePassword) {
                passwordRequest.send(data);
                passwordRequest.onload = function() {
                    that.getUserManageList();
                }
            } else {
                if(password !== rePassword) {
                    window.alert('两次输入密码不相同');
                    closeWindow = false;
                }
            }
            userLevelRequest.onload = function() {
                that.getUserManageList();
            }
            userGroupRequest.onload = function() {
                that.getUserManageList();
            }
        } catch(error) {
            console.log(error);
        }
        if(closeWindow) this.shouldShowUserManageEditView();
    }

    deleteUserGroup = (index) => {
        const that = this;
        const result = window.confirm("确定删除该用户组吗?");
        if(result) {
            try{
                const request = new XMLHttpRequest();
                request.open('POST', `${this.props.defaultURL}delgroup?groupname=${this.state.userGroupList[index]}`);
                const data = this.getManagerData();
                request.send(data);
                request.onload = function() {
                    that.getUserGroupList();
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    addUserGroup = () => {
        const that = this;
        const result = window.prompt("输入新的用户组名", "");
        let rightGroupName = 1;
        if(rightGroupName !== -1) {
            try{
                const request = new XMLHttpRequest();
                request.open('POST', `${this.props.defaultURL}addgroup?groupname=${result}`);
                const data = this.getManagerData();
                request.send(data);
                request.onload = function() {
                    that.getUserGroupList();
                }
            } catch(error) {
                console.log(error);
            }
        } else {
            if(result) window.alert("请输入正确的用户组名");
        }
    }

    showLabelStatistics = (index) => {
        const that = this;
        this.getTagProgress(this.state.taskList[index].taskName, function() {
            const currentTagProgress = that.state.taskList[index].tagProgress;
            try {
                const request = new XMLHttpRequest();
                request.open('GET', `${that.props.defaultURL}labelstatistics?usrname=${that.props.username}&taskname=${that.state.taskList[index].taskName}`);
                request.send();
                request.onload = function() {
                    const tagStatisticsList = that.getFormatLabelStatistics(request.response);
                    that.setState({tagStatisticsList, currentTagProgress}, function() {
                        that.shouldShowLabelStatisticsView();
                    });
                }
            } catch(error) {
                console.log(error);
            }
        });

    }

    getFormatLabelStatistics = (data) => {
        const arrayData = data.split(',');
        const newArrayData = [];
        const tagStatisticsList = [];
        if(arrayData[0] !== '{}') {
            for(let i=0; i<arrayData.length; i++) {
                const innerArrayData = arrayData[i].split(':');
                newArrayData.push(innerArrayData);
            }
            for(let i=0; i<newArrayData.length; i++) {
                const tagName = newArrayData[i][0].slice(3, newArrayData[i][0].length - 1);
                let tagNum = '';
                if(i !== newArrayData.length - 1) {
                    tagNum = newArrayData[i][1].slice(1, newArrayData[i][1].length);
                } else {
                    tagNum = newArrayData[i][1].slice(1, newArrayData[i][1].length - 1);
                }
                tagStatisticsList.push({tagName, tagNum});
            }
        }

        return tagStatisticsList;
    }

    unicodeToChar = (text) => {
        return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    }

    render() {
        return (
            <div className="w3-light-grey full-height">
                <i onClick={this.refreshTaskPage} className="fa fa-refresh et-refresh-button" aria-hidden="true"></i>
                {
                    this.state.showUserManageEditView ?
                        <div className="popup w3-modal">
                            <div className="w3-modal-content w3-container w3-text-white" style={{width: '600px', padding: '0px 0px 36px 0px', background: 'rgba(0, 0, 0, 0.7)', borderRadius: '10px'}}>
                                <div className="w3-container" style={{fontSize: '1.4em'}}>
                                    <p style={{marginBottom: '10px'}}>{`用户名: ${this.state.editState.userName}`}</p>
                                </div>
                                <div className="w3-container">
                                    <p>邮箱:</p>
                                    <input onChange={this.handleEditEmail} value={this.state.editState.email} className="w3-input" type="text"/>
                                </div>
                                <div className="w3-container">
                                    <p>用户权限:</p>
                                    <select onChange={this.handleEditUserLevel} value={this.getUserLevelName(this.state.editState.userLevel)} className="w3-select">
                                        <option>普通用户</option>
                                        <option>编辑用户</option>
                                        <option>管理用户</option>
                                        <option>超级用户</option>
                                    </select>
                                </div>
                                <div className="w3-container">
                                    <p>所在组别:</p>
                                    <select onChange={this.handleEditUserGroup} value={this.state.editState.userGroup} className="w3-select">{
                                        this.state.userGroupList.map((group, index) => (
                                            <option key={group + index}>{group}</option>
                                        ))
                                    }</select>
                                </div>
                                <div className="w3-container">
                                    <p>新密码:</p>
                                    <input onChange={this.handleEditPassword} className="w3-input" type="password"/>
                                    <p>确认新密码:</p>
                                    <input onChange={this.handleEditRePassword} className="w3-input" type="password"/>
                                </div>
                                <div className="w3-container" style={{marginTop: '20px'}}>
                                    <button onClick={this.shouldShowUserManageEditView} className="w3-button w3-orange w3-left w3-text-white" style={{width: '90px', borderRadius: '5px'}}>取消</button>
                                    <button onClick={this.saveEditResult} className="w3-button w3-orange w3-right w3-text-white" style={{width: '90px', borderRadius: '5px'}}>保存</button>
                                </div>
                            </div>
                        </div>
                        : null
                }
                {
                    this.state.showInputView ? (
                        <div className="popup w3-modal">
                            <i onClick={this.closeInputView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <div className="flex-box" style={{width: '40%', margin: '0 auto', position: 'absolute', top: '30%', left: '30%'}}>
                                <select id="newTaskType">
                                    <option>物体检测</option>
                                    <option>图片分类</option>
                                </select>
                                <input placeholder="输入新的任务名称" onChange={this.handleInputChange} value={this.state.newTaskName} className="w3-input" type="text"/>
                                <button onClick={this.onAddTask} className="w3-button w3-orange">添加</button>
                            </div>
                        </div>
                    ) : null
                }
                {
                    this.state.showStartAndNumInputView ? (
                        <div className="popup" style={{background: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '200'}}>
                            <i onClick={this.closeStartAndNumInputView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <div className="flex-box" style={{width: '40%', margin: '0 auto', position: 'absolute', top: '30%', left: '30%'}}>
                                <input onChange={this.handleStartInputChange} value={this.state.start} placeholder="输入起始序号" className="w3-input" type="number" style={{width: '40%'}}/>
                                <input onChange={this.handleNumInputChange} value={this.state.num} placeholder="输入图片数量" className="w3-input" type="number" style={{width: '40%', marginLeft: '2px'}}/>
                                <button onClick={this.confirmDistrTaskToUser} className="w3-button w3-orange" style={{width: '20%', marginLeft: '2px'}}>确定分配</button>
                            </div>
                        </div>
                    ) : null
                }
                {
                    this.state.showDistributeTaskView ? (
                        <div className="popup" style={{background: 'rgba(0, 0, 0, 0.6)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100'}}>
                            <i onClick={this.closeDistributeTaskView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <div className="w3-content w3-text-white et-margin-top-64" style={{width: '60%', height: '70%'}}>
                                <h2 className="w3-center">{this.state.currentTaskName}</h2>
                                <h3 className="et-margin-top-32">已分配用户</h3>
                                <table className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                                    <thead className="w3-orange w3-text-white">
                                        <tr>
                                            <th>用户名</th>
                                            <th>用户权限</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.distredUserList.map((user, index) => (
                                            <tr key={user.userName + user.userLevel}>
                                                <td>{user.userName}</td>
                                                <td>{this.getUserLevelName(user.userLevel)}</td>
                                                <td><i onClick={this.unDistributeTaskToUser.bind(this, index)} className="fa fa-calendar-times-o table-item-button" aria-hidden="true"> 取消分配</i></td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                    <tfoot></tfoot>
                                </table>
                                <h3 className="et-margin-top-64">分配任务</h3>
                                <table className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                                    <thead className="w3-orange w3-text-white">
                                        <tr>
                                            <th>用户名</th>
                                            <th>用户权限</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.distrableUserList.map((user, index) => (
                                            <tr key={user.userName + user.userLevel}>
                                                <td>{user.userName}</td>
                                                <td>{this.getUserLevelName(user.userLevel)}</td>
                                                <td><i onClick={this.distributeTaskToUser.bind(this, index)} className="fa fa-calendar-check-o table-item-button" aria-hidden="true"> 分配任务</i></td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                            <div></div>
                        </div>
                    ) : null
                }
                <div className="w3-orange flex-box" style={{height: '80px', alignItems: 'center', position: 'relative'}}>
                    <div style={{position: 'absolute', left: '15px'}}>
                        <div className="flex-box" style={{justifyContent: 'center', alignItems: 'center'}}>
                            <i onMouseOver={this.showPersonPanel} className="fa fa-user-circle-o w3-text-white w3-xxlarge" aria-hidden="true"></i>
                            <h3 className="w3-text-white">&nbsp;{`${this.props.username} - ${this.getUserLevelName(this.props.userLevel)}`}</h3>
                        </div>
                        {
                            this.state.showPersonPanel ?
                            <div className="popup" style={{position: 'absolute', left: '-2px', top: '56px'}}>
                                <button onClick={this.props.onLogout} onMouseOut={this.closePersonPanel} className="w3-button w3-black" style={{borderRadius: '20px'}}>登出</button>
                            </div>
                            : null
                        }
                    </div>
                </div>
                {
                    this.state.showImageView === true ? (
                        <div onClick={this.closeImageView} className="popup w3-center w3-padding-64" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100'}}>
                            <h3 className="w3-text-white">{`训练进度: ${this.state.currentProgress}%`}</h3>
                            <img className="w3-image" id="train-state"/>
                        </div>
                    ) : null
                }
                {
                    this.state.showLabelStatisticsView === true ? (
                        <div onClick={this.shouldShowLabelStatisticsView} className="popup w3-center w3-padding-64" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100'}}>
                            <h3 className="w3-text-white">{`标注进度: ${this.state.currentTagProgress}`}</h3>
                            <table className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered" style={{width: '50%', margin: '0 auto', marginTop: '10px'}}>
                                <thead className="w3-orange w3-text-white">
                                    <tr>
                                        <th>标签名</th>
                                        <th>已标记数量</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.tagStatisticsList.map((tag) => (
                                        <tr key={tag.tagName + tag.tagNum}>
                                            <td>{this.unicodeToChar(tag.tagName)}</td>
                                            <td>{tag.tagNum}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                                <tfoot></tfoot>
                            </table>
                        </div>
                    ) : null
                }
                <div className={`et-content ${this.props.userLevel === 3 ? 'et-padding-128' : 'w3-padding-64'}`}>
                    <div style={{position: 'relative'}}>
                        <h3 className="et-margin-top-32 et-table-title">任务列表</h3>
                        {
                            (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                            <div onClick={this.popupInputView} style={{position: 'absolute', right: '5px', top: '0px'}}>
                                <i className="fa fa-plus-circle add-task-button w3-text-black" aria-hidden="true"></i>
                            </div>
                            : null
                        }
                    </div>
                    <table ref="theTaskTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                        <thead className="w3-green">
                            <tr>
                                <th>编号</th>
                                <th>任务名称</th>
                                <th>创建时间</th>
                                <th>任务状态</th>
                                <th>任务类型</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>{
                            this.state.taskList.map((task, index) => (
                                <tr key={task.taskName + index}>
                                    <td>{index + 1}</td>
                                    {
                                        (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                        <td className="et-taskname-button" onClick={this.showDistributeTaskView.bind(this, index)}>{task.taskName}</td>
                                        : <td>{task.taskName}</td>
                                    }
                                    <td>{task.time}</td>
                                    <td>{this.getTaskStateName(task.taskState)}</td>
                                    <td>{this.getTaskTypeName(task.taskType)}</td>
                                    <td>
                                        {
                                            parseInt(task.taskType) === 0 ?
                                            <Link onClick={this.onLinkToTag.bind(this, index)} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                                            : null
                                        }
                                        {
                                            parseInt(task.taskType) === 1 ?
                                            <Link onClick={this.onLinkToTag.bind(this, index)} to="/tagobject"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                                            : null
                                        }
                                        <i onClick={this.showLabelStatistics.bind(this, index)} className="fa fa-area-chart table-item-button w3-margin-left"> 标注统计</i>
                                        {
                                            (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                            <i onClick={this.onStartTask.bind(this, index)} className={`fa fa-play-circle ${task.taskState === '0' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true">{task.taskState === '3' ? ' 重新训练' : ' 开启训练'}</i>
                                            : null
                                        }
                                        {
                                            (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                            <i onClick={this.onStopTask.bind(this, index)} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true"> 停止训练</i>
                                            : null
                                        }
                                        {
                                            (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                            <i onClick={this.onLookTrainState.bind(this, index)} className={`fa fa-search ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true"> 查看训练状态</i>
                                            : null
                                        }
                                        {
                                            (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                            <Link style={{cursor: 'context-menu'}} onClick={this.onLinkToTest.bind(this, index)} to={task.taskState === '3' ? "/test" : "/"}><i className={`fa fa-cog ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true"> 测试</i></Link>
                                            : null
                                        }
                                        {
                                            (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                            <i onClick={this.onDeleteTask.bind(this, index)} className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> 删除</i>
                                            : null
                                        }
                                    </td>
                                </tr>
                            ))
                        }</tbody>
                        <tfoot></tfoot>
                    </table>
                    {
                        (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                        <h3 className="et-margin-top-64 et-table-title">Worker列表</h3>
                        : null
                    }
                    {
                        (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                        <table ref="theWorkerTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                            <thead className="w3-green">
                                <tr>
                                    <th>编号</th>
                                    <th>worker名称</th>
                                    <th>worker状态</th>
                                    <th>显卡使用情况</th>
                                    <th>正在服务的任务名称</th>
                                    <th>更新时间</th>
                                </tr>
                            </thead>
                            <tbody>{
                                this.state.workerList.map((worker, index) => (
                                    <tr key={worker.workerName + index}>
                                        <td>{index + 1}</td>
                                        <td>{worker.workerName}</td>
                                        <td>{this.getWorkerStateName(worker.workerState)}</td>
                                        <td>{worker.GPU}</td>
                                        <td>{worker.taskName}</td>
                                        <td>{worker.updateTime}</td>
                                    </tr>
                                ))
                            }</tbody>
                            <tfoot></tfoot>
                        </table>
                        : null
                    }
                    {
                        this.props.userLevel === 3 ?
                        <h3 className="et-margin-top-64 et-table-title">用户管理列表</h3>
                        : null
                    }
                    {
                        this.props.userLevel === 3 ?
                        <table className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                            <thead className="w3-green">
                                <tr>
                                    <th>用户名</th>
                                    <th>邮箱</th>
                                    <th>激活状态</th>
                                    <th>用户权限</th>
                                    <th>所在组别</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>{
                                this.state.userManageList.map((user, index) => (
                                    <tr key={user.userName + user.email}>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.activeState === '0' ? '未激活' : '已激活'}</td>
                                        <td>{this.getUserLevelName(user.userLevel)}</td>
                                        <td>{user.userGroup}</td>
                                        <td>
                                            <i onClick={this.deleteUser.bind(this, index)} className="fa fa-minus-square table-item-button"> 删除用户</i>
                                            <i onClick={this.shouldShowUserManageEditView.bind(this, index)} className="fa fa-cog table-item-button w3-margin-left"> 编辑用户</i>
                                        </td>
                                    </tr>
                                ))
                            }</tbody>
                            <tfoot></tfoot>
                        </table>
                        : null
                    }
                    {
                        this.props.userLevel === 3 ?
                        <div style={{position: 'relative'}}>
                            <h3 className="et-margin-top-64 et-table-title">用户组列表</h3>
                            <div style={{position: 'absolute', right: '5px', top: '0px'}}>
                                <i onClick={this.addUserGroup} className="fa fa-plus-circle add-task-button w3-text-black" aria-hidden="true"></i>
                            </div>
                        </div>
                        : null
                    }
                    {
                        this.props.userLevel === 3 ?
                        <table ref="theTaskTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                            <thead className="w3-green">
                                <tr>
                                    <th>组名</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>{
                                this.state.userGroupList.map((group, index) => (
                                    <tr key={group + index}>
                                        <td>{group}</td>
                                        <td>
                                            <i onClick={this.deleteUserGroup.bind(this, index)} className="fa fa-minus-circle table-item-button"> 删除</i>
                                        </td>
                                    </tr>
                                ))
                            }</tbody>
                        </table>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default TaskPage
