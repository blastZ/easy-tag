import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TopBar from './TopBar'
import { getUserLevelCode } from '../utils/Task';
import TrainTaskTable from './tables/TrainTaskTable';
import TaskTable from './tables/TaskTable';
import OperationsTable from './tables/OperationsTable';
import WorkerTable from './tables/WorkerTable';
import UserManageTable from './tables/UserManageTable';
import UserGroupTable from './tables/UserGroupTable';
import { connect } from 'react-redux';
import { changeTaskName, getTrainStateLog, getManagerData } from '../actions/app_action';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import GlobalSetTable from './tables/GlobalSetTable';
import { DEFAULT_TAGED_NUM, DEFAULT_TAGED_PROGRESS } from '../utils/global_config';
import RefreshIcon from 'material-ui-icons/Cached';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import DistriTaskView from './popups/DistriTaskView';
import NewTaskView from './popups/NewTaskView';
import Divider from 'material-ui/Divider';
import Tabs, { Tab } from 'material-ui/Tabs';
import { getTrainTaskList } from '../actions/task_action';
import TrainSettingView from './popups/TrainSettingView';

const styles = theme => ({
  refreshButton: {
    width: 48,
    height: 48,
    background: 'linear-gradient(to right, #5B86E5, #4788ca)'
  },
  refreshLabel: {
    width: 30,
    height: 30
  }
});

class TaskPage extends Component {
    state = {
        taskList: [], //taskName: 'a', time: '2017-07-28 14:42:19', progress: '0.0', tagProgress: '1000/1000', taskState: '1', taskType: '1'
        workerList: [], //workerName: 'a', workerState: '0', taskName: 'a', GPU: '2048/8192', updateTime: '2017-07-02 09:43:12'
        distredUserList: [], //userName: 'aaa', userLevel: '0'
        distrableUserList: [], //userName: 'aaa', userLevel: '0'
        userManageList: [], //userName: 'aaa', email: 'aa@aa.com', activeState: '0', userLevel: '0', userGroup: 'common'
        userGroupList: [], // 'common', 'test'
        statisticsUrl: '',
        workerOwnerList: [], //"public", "codvision"
        showInputView: false,
        showImageView: false,
        showImageViewForTrainTask: false,
        showTrainSettingView: false,
        showPersonPanel: false,
        showDistributeTaskView: false,
        showLabelStatisticsView: false,
        showUserManageEditView: false,
        showEditWorkerOwner: false,
        currentTaskName: '',
        currentTaskType: -1,
        editWorkerIndex: -1,
        destination: '/tag',
        currentUserName: '',
        currentTrainTaskUserName: '',
        loadingTrainObjectData: false,
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
        },
        theRefreshInterval: null,
        tabIndex: 0,
        taskStructureList: [],
        currentTaskStructure: '',
        showLabelStatisticsLoading: false,
    }

    shouldShowLabelStatisticsLoading = () => {
      this.setState({
        showLabelStatisticsLoading: !this.state.showLabelStatisticsLoading
      })
    }

    handleTabChange = (e, tabIndex) => {
        this.setState({tabIndex});
        if(this.props.userLevel === 2) {
          switch(tabIndex) {
            case 0: this.getTaskList(); break;
            case 1: this.getWorkerList(); break;
          }
        }
        if(this.props.userLevel === 3) {
          switch(tabIndex) {
            case 0: this.getTaskList(); break;
            case 2: this.getWorkerList(); break;
            case 3: this.getUserManageList(); break;
            case 4: this.getUserGroupList(); break;
          }
        }
    }

    openTrainSettingView = () => {
      this.setState({
        showTrainSettingView: true
      })
    }

    closeTrainSettingView = () => {
      this.setState({
        showTrainSettingView: false
      })
    }

    outputTagData = () => {
      fetch(`${this.props.defaultURL}getlabelzip?usrname=${this.state.currentUserName}&taskname=${this.state.currentTaskName}`, {
        method: 'POST',
        body: this.getManagerData()
      })
        .then((response) => response.text())
        .then((result) => {
          window.open(result);
        })
    }

    outputTrainObjectData = () => {
        try {
            this.setState({loadingTrainObjectData: true});
            const request = new XMLHttpRequest();
            request.open('POST', `${this.props.defaultURL}getmodel?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&structure=${this.state.currentTaskStructure}`);
            const data = this.getManagerData();
            request.send(data);
            request.onload = () => {
                this.setState({loadingTrainObjectData: false});
                window.open(request.response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    outputTrainObjectDataForTrainTask = () => {
        try {
            this.setState({loadingTrainObjectData: true});
            const request = new XMLHttpRequest();
            request.open('POST', `${this.props.defaultURL}getmodel?usrname=${this.state.currentTrainTaskUserName}&taskname=${this.state.currentTaskName}`);
            const data = this.getManagerData();
            request.send(data);
            request.onload = () => {
                this.setState({loadingTrainObjectData: false});
                window.open(request.response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    shouldShowImageViewForTrainTask = () => {
        this.setState({showImageViewForTrainTask: !this.state.showImageViewForTrainTask});
    }

    shouldShowEditWorkerOwner = (index) => {
        if(!this.state.showEditWorkerOwner) {
            this.getWorkerOwnerList(index);
        } else {
            this.setState({showEditWorkerOwner: !this.state.showEditWorkerOwner, editWorkerIndex: -1});
        }
    }

    saveWorkerOwnerChange = (index) => {
        const newOwner = document.getElementById('workerOwnerSelect').value;
        try {
            const request = new XMLHttpRequest();
            request.open('POST', `${this.props.defaultURL}modifyworkerowner?workername=${this.state.workerList[index].workerName}&ownername=${newOwner}`);
            const data = this.getManagerData();
            request.send(data);
            this.setState({showEditWorkerOwner: !this.state.showEditWorkerOwner}, () => {
                this.refreshTaskPage();
            });
        } catch (error) {
            console.log(error);
        }
    }

    getWorkerOwnerList = (index) => {
        try {
            const request = new XMLHttpRequest();
            request.open('POST', `${this.props.defaultURL}getmanagerusrlist`);
            const data = this.getManagerData();
            request.send(data);
            request.onload = () => {
                const arrayData = request.response.split(',');
                let workerOwnerList = [];
                for(let i=0; i<arrayData.length; i++) {
                    if(i === arrayData.length - 1) {
                        workerOwnerList.push(arrayData[i].slice(2, arrayData[i].length - 2));
                    } else {
                        workerOwnerList.push(arrayData[i].slice(2, arrayData[i].length - 1));
                    }
                }
                this.setState({workerOwnerList}, () => {
                    this.setState({showEditWorkerOwner: !this.state.showEditWorkerOwner, editWorkerIndex: index});
                });
            }

        } catch(error) {
            console.log(error);
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
        const userLevel = getUserLevelCode(e.target.value);
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

    getTaskList = () => {
      fetch(`${this.props.defaultURL}gettasklist?usrname=${this.props.username}`)
        .then((response) => response.text())
        .then((result) => {
          const arrayData = this.getArrayData(result);
          this.addTask(arrayData);
        })
    }

    getWorkerList = () => {
        const that = this;
        const getWorkerList = new XMLHttpRequest();
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
    }

    componentDidMount() {
        this.getTaskList();
        const theRefreshInterval = window.setInterval(this.refreshInterval, 60000);
        this.setState({theRefreshInterval});
    }

    refreshInterval = () => {
        this.refreshTaskPage();
    }

    componentWillUnmount() {
        window.clearInterval(this.state.theRefreshInterval);
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
            showInputView: false
        });
    }

    closeImageView = () => {
        this.setState({showImageView: false});
    }

    addNewTask = (taskTypeCode, taskName) => {
        const that = this;
        const result = /^[a-zA-Z0-9]+$/.test(taskName);
        if(result === false) {
            window.alert('请输入正确的任务名');
        } else {
            const getNewTask = new XMLHttpRequest();
            getNewTask.open('GET', `${this.props.defaultURL}addtask?usrname=${this.props.username}&taskname=${taskName}&type=${taskTypeCode}`);
            getNewTask.send();
            getNewTask.onload = function() {
                const arrayData = that.getArrayData(getNewTask.response);
                that.addTask(arrayData);
            }
        }
    }

    addTask = (arrayData) => {
      if(arrayData.length > 4) {
          this.setState({showInputView: false});
          const newTaskList = [];
          for(let i=0; i<arrayData.length; i=i+6) {
              const  taskName = arrayData[i].slice(4, arrayData[i].length - 1);
              const time = arrayData[i + 1].slice(3, 22);
              const progress = arrayData[i + 2].slice(1,arrayData[i + 2].length);
              const taskState = arrayData[i + 3].slice(1, 2);
              const taskType = arrayData[i + 4].slice(1, 2);
              const taskTrained = arrayData[i + 5].slice(1, 2) === '1' ? true : false;
              newTaskList.push({taskName, time,tagProgress: '0/0', progress, taskState, taskType, taskTrained});
          }
          this.setState({taskList: newTaskList});
      }
    }

    getTagProgress = (taskName, showLabelStatistics) => {
        const that = this;
        const getFileCount = new XMLHttpRequest();
        getFileCount.open('GET', `${this.props.defaultURL}filecount?usrname=${this.props.username}&taskname=${taskName}`);
        getFileCount.send();
        getFileCount.onload = function() {
            const theFileCount = getFileCount.response;
            const getTagedFileCount = new XMLHttpRequest();
            getTagedFileCount.open('GET', `${that.props.defaultURL}labeledfilecount?usrname=${that.props.username}&taskname=${taskName}`);
            getTagedFileCount.send();
            getTagedFileCount.onload = function() {
                const theTagedFileCount = getTagedFileCount.response;
                const tagProgress = `${theTagedFileCount}/${theFileCount}`;
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

    getTagProgressForTrainTask = (task, showLabelStatisticsForTrainTask) => {
        const that = this;
        const getFileCount = new XMLHttpRequest();
        getFileCount.open('GET', `${this.props.defaultURL}filecount?usrname=${task.userName}&taskname=${task.taskName}`);
        getFileCount.send();
        getFileCount.onload = function() {
            const theFileCount = getFileCount.response;
            const getTagedFileCount = new XMLHttpRequest();
            getTagedFileCount.open('GET', `${that.props.defaultURL}labeledfilecount?usrname=${task.userName}&taskname=${task.taskName}`);
            getTagedFileCount.send();
            getTagedFileCount.onload = function() {
                const theTagedFileCount = getTagedFileCount.response;
                const tagProgress = `${theTagedFileCount}/${theFileCount}`;
                task.tagProgress = tagProgress;
                showLabelStatisticsForTrainTask(task);
            }
        }
    }

    addWorker = (arrayData) => {
        if(arrayData.length > 4) {
            const newWorkerList = [];
            for(let i=0; i<arrayData.length; i=i+6) {
                const workerName = arrayData[i].slice(4, arrayData[i].length - 1);
                const workerState = arrayData[i + 1].slice(1, 2);
                const taskName = arrayData[i + 2].slice(3, arrayData[i + 2].length - 1);
                const GPU = arrayData[i + 3].slice(3, arrayData[i + 3].length - 1);
                const updateTime = arrayData[i + 4].slice(3, 22);
                let owner = '';
                if(i + 5 === arrayData.length - 1) {
                    owner = arrayData[i + 5].slice(3, arrayData[i + 5].length - 3);
                } else {
                    owner = arrayData[i + 5].slice(3, arrayData[i + 5].length - 2);
                }
                newWorkerList.push({workerName, workerState, GPU, taskName, updateTime, owner});
            }
            this.setState({workerList: newWorkerList});
        } else {
            this.setState({workerList: []});
        }
    }

    getArrayData = (data) => {
        data = data.split(',');
        return data;
    }

    changeTaskStructure = (e) => {
      this.setState({
        currentTaskStructure: e.target.value
      }, () => {
        this.props.dispatch(getTrainStateLog(this.props.username, this.props.taskName, this.state.currentTaskStructure));
        try {
          const lookTrainState = new XMLHttpRequest();
          lookTrainState.open('GET', `${this.props.defaultURL}taskinfo?usrname=${this.props.username}&taskname=${this.props.taskName}&structure=${this.state.currentTaskStructure}`);
          lookTrainState.send();
          lookTrainState.onload = function() {
            document.getElementById('train-state').src = lookTrainState.response;
          }
        } catch(error) {
            console.log(error);
        }
      })
    }

    changeTaskStructureForTrainTask = (e) => {
      this.setState({
        currentTaskStructure: e.target.value
      }, () => {
        this.props.dispatch(getTrainStateLog(this.state.currentTrainTaskUserName, this.state.currentTaskName, this.state.currentTaskStructure));
        try {
          const lookTrainState = new XMLHttpRequest();
          lookTrainState.open('GET', `${this.props.defaultURL}taskinfo?usrname=${this.state.currentTrainTaskUserName}&taskname=${this.state.currentTaskName}&structure=${this.state.currentTaskStructure}`);
          lookTrainState.send();
          lookTrainState.onload = function() {
            document.getElementById('train-state').src = lookTrainState.response;
          }
        } catch(error) {
            console.log(error);
        }
      })
    }

    onLookTrainState = (index) => {
      this.props.dispatch(changeTaskName(this.state.taskList[index].taskName));
      const that = this;
      const currentProgress = this.state.taskList[index].progress;
      fetch(`${this.props.defaultURL}taskinfostructure?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`)
        .then((response) => response.json())
        .then((result) => {
          this.setState({
            taskStructureList: result,
            currentTaskStructure: result[0]
          })
          this.props.dispatch(getTrainStateLog(this.props.userName, this.state.taskList[index].taskName, result[0]));
          const lookTrainState = new XMLHttpRequest();
          lookTrainState.open('GET', `${this.props.defaultURL}taskinfo?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}&structure=${result[0]}`);
          lookTrainState.send();
          lookTrainState.onload = function() {
              that.setState({showImageView: true, currentProgress, currentTaskName: that.state.taskList[index].taskName}, function() {
                  document.getElementById('train-state').src = lookTrainState.response;
              })
          }
        })
    }

    onLookTrainStateForTrainTask = (task) => {
        const that = this;
        const taskState = task.taskState;
        const currentProgress = task.progress;
        if(taskState === '2' || taskState === '3') {
            try {
              fetch(`${this.props.defaultURL}taskinfostructure?usrname=${task.userName}&taskname=${task.taskName}`)
                .then((response) => response.json())
                .then((result) => {
                  this.setState({
                    taskStructureList: result,
                    currentTaskStructure: result[0]
                  })
                  this.props.dispatch(getTrainStateLog(task.userName, task.taskName, result[0]));
                  const lookTrainState = new XMLHttpRequest();
                  lookTrainState.open('GET', `${this.props.defaultURL}taskinfo?usrname=${task.userName}&taskname=${task.taskName}&structure=${result[0]}`);
                  lookTrainState.send();
                  lookTrainState.onload = function() {
                    that.setState({showImageViewForTrainTask: !that.state.showImageViewForTrainTask, currentProgress, currentTaskName: task.taskName, currentTrainTaskUserName: task.userName}, function() {
                        document.getElementById('train-state').src = lookTrainState.response;
                    })
                  }
                })
            } catch(error) {
                console.log(error);
            }
        }
    }

    startTrain = (trainParams) => {
        this.getTagProgress(this.state.currentTaskName, () => {
            const str = this.state.taskList.filter((task) => (task.taskName === this.state.currentTaskName))[0].tagProgress;
            const numStr = str.split('/');
            const tagedImageNum = parseInt(numStr[0]);
            const AllImageNum = parseInt(numStr[1]);
            if(tagedImageNum < DEFAULT_TAGED_NUM) {
                window.alert(`标注图片数量不足${DEFAULT_TAGED_NUM}`);
            } else if((tagedImageNum / AllImageNum) < DEFAULT_TAGED_PROGRESS) {
                window.alert(`完成度不足${DEFAULT_TAGED_PROGRESS * 100}%`);
            } else {
              this.closeTrainSettingView();
              fetch(`${this.props.defaultURL}savetrainparams?usrname=${this.props.username}&taskname=${this.state.currentTaskName}`, {
                method: 'POST',
                body: JSON.stringify(trainParams)
              }).then((response) => response.text())
                .then((result) => {
                  fetch(`${this.props.defaultURL}starttask?usrname=${this.props.username}&taskname=${this.state.currentTaskName}`)
                    .then((response) => response.text())
                    .then((result) => {
                      const arrayData = this.getArrayData(result);
                      this.addTask(arrayData);
                    })
                })
            }
        });
    }

    onStartTask = (index) => {
      this.setState({currentTaskName: this.state.taskList[index].taskName, currentTaskType: parseInt(this.state.taskList[index].taskType, 10)});
      this.openTrainSettingView();
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

    onStopTaskForTrainTask = (task) => {
        const that = this;
        const taskState = task.taskState;
        if(taskState === '1' || taskState === '2') {
            const result = window.confirm('确定停止训练吗?');
            if(result) {
                try {
                    const request = new XMLHttpRequest();
                    request.open('GET', `${this.props.defaultURL}stoptask?usrname=${task.userName}&taskname=${task.taskName}`);
                    request.send();
                    request.onload = () => {
                        that.refreshTaskPage();
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

    onDeleteTaskForTrainTask = (task) => {
        const result = window.confirm('确定删除该任务吗?');
        if(result) {
            const that = this;
            try {
                const deleteTask = new XMLHttpRequest();
                deleteTask.open('GET', `${this.props.defaultURL}deltask?usrname=${task.userName}&taskname=${task.taskName}`);
                deleteTask.send();
                deleteTask.onload = function() {
                    that.refreshTaskPage();
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

    onLinkToSegment = (index) => {
        this.props.dispatch(changeTaskName(this.state.taskList[index].taskName));
        this.props.history.push('/segment');
    }

    onLinkToTest = (index) => {
      this.props.onChangeUserAndTask(this.props.username, this.state.taskList[index].taskName);
      this.props.dispatch(changeTaskName(this.state.taskList[index].taskName));
    }

    onLinkToVideo = (index) => {
      this.props.dispatch(changeTaskName(this.state.taskList[index].taskName));
      this.props.history.push('/video');
    }

    onLinkToDaub = (index) => {
      this.props.dispatch(changeTaskName(this.state.taskList[index].taskName));
      this.props.history.push('/daub');
    }

    onLinkToPoint = (index) => {
      this.props.dispatch(changeTaskName(this.state.taskList[index].taskName));
      this.props.onChangeUserAndTask(this.props.username, this.state.taskList[index].taskName);
      this.props.onInitStartAndNum();
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
        const { tabIndex } = this.state;
        if(tabIndex === 0) {
            this.getTaskList();
        }else if(tabIndex === 1) {
            if(this.refs.trainTaskList) {
              this.props.dispatch(getManagerData());
              this.props.dispatch(getTrainTaskList());
            }
        }else if(tabIndex === 2) {
            if(this.refs.workerTable) {
              this.getWorkerList();
            }
        }else if(tabIndex === 3) {
            this.getUserManageList();
        }else if(tabIndex === 4) {
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

    closeDistributeTaskView = () => {
        this.setState({showDistributeTaskView: false});
    }

    setCurrentUser = (index) => {
        const userName = this.state.distrableUserList[index].name;
        this.setState({currentUserName: userName});
    }

    distrTaskToUser = (start, num) => {
        const fileCount = parseInt(this.state.currentTaskFileCount, 10);
        start = parseInt(start, 10);
        num = parseInt(num ,10);
        if((start + num - 1) > fileCount) {
            window.alert(`总共 ${fileCount} 张,请检查输入`);
        } else if(start === '' || num === '') {
            window.alert('起始序号或图片数量不能为空');
        } else {
            const that = this;
            try{
                const request = new XMLHttpRequest();
                request.open('GET', `${this.props.defaultURL}distributetask?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&distusrname=${this.state.currentUserName}&start=${start}&num=${num}`);
                request.send();
                request.onload = function() {
                    that.getDistredUserList(that.state.currentTaskName);
                    that.getDistrableUserList();
                    that.setState({
                        currentUserName: '',
                    })
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    unDistributeTaskToUser = (index) => {
        const userName = this.state.distredUserList[index].name;
        const distTaskName = this.state.distredUserList[index].taskName;
        const that = this;
        try{
            const request = new XMLHttpRequest();
            request.open('GET', `${this.props.defaultURL}undistributetask?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&distusrname=${userName}&disttaskname=${distTaskName}`);
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

    getDistrableUserList = (cb=null) => {
        const that = this;
        try{
            const request = new XMLHttpRequest();
            request.open('GET', `${this.props.defaultURL}distrableuserlist?usrname=${this.props.username}`);
            request.send();
            request.onload = function() {
                const distrableUserList = that.getFormatAbleUserList(request.response);
                that.setState({distrableUserList});
                if(cb) cb(distrableUserList);
            }
        } catch(error) {
            console.log(error);
        }
    }

    getFormatUserList = (str) => {
        const arrayData = str.split(',');
        const distredUserList = [];
        if(arrayData.length > 1) {
            for(var i=0; i<arrayData.length; i=i+4) {
                const name = arrayData[i].slice(3, arrayData[i].length - 1);
                const level = arrayData[i + 1].slice(1, 2);
                const taskName = arrayData[i + 2].slice(2, arrayData[i + 2].length - 1);
                const tagedNum = i + 4 === arrayData.length ? arrayData[i+3].slice(1, arrayData[i+3].length - 2) : arrayData[i + 3].slice(1, arrayData[i + 3].length - 1);
                distredUserList.push({name, level, taskName, tagedNum});
            }
        }
        return distredUserList;
    }

    getFormatAbleUserList = (str) => {
      const arrayData = str.split(',');
      const distrableUserList = [];
      if(arrayData.length > 1) {
          for(var i=0; i<arrayData.length; i=i+2) {
              const name = arrayData[i].slice(3, arrayData[i].length - 1);
              const level = arrayData[i + 1].slice(1, 2);
              distrableUserList.push({name, level});
          }
      }
      return distrableUserList;
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
      this.shouldShowLabelStatisticsLoading();
      this.getTagProgress(this.state.taskList[index].taskName, () => {
        fetch(`${this.props.defaultURL}labelstatisticsfig?usrname=${this.props.userName}&taskname=${this.state.taskList[index].taskName}`)
          .then((response) => response.text())
          .then((result) => {
            this.shouldShowLabelStatisticsLoading();
            this.setState({
              currentUserName: this.props.userName,
              currentTagProgress: this.state.taskList[index].tagProgress,
              statisticsUrl: result,
              currentTaskName: this.state.taskList[index].taskName
            }, () => {
              this.shouldShowLabelStatisticsView();
            })
          })
      });
    }

    showLabelStatisticsForTrainTask = (task) => {
        this.shouldShowLabelStatisticsLoading();
        this.getTagProgressForTrainTask(task, (task) => {
          fetch(`${this.props.defaultURL}labelstatisticsfig?usrname=${task.userName}&taskname=${task.taskName}`)
            .then((response) => response.text())
            .then((result) => {
              this.shouldShowLabelStatisticsLoading();
              this.setState({
                currentUserName: task.userName,
                currentTagProgress: task.tagProgress,
                statisticsUrl: result,
                currentTaskName: task.taskName
              }, () => {
                this.shouldShowLabelStatisticsView();
              })
            })
        });
    }

    unicodeToChar = (text) => {
        return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    }

    render() {
      const { userLevel } = this.props;
      const { tabIndex } = this.state;
        return (
            <div className="w3-light-grey full-height">
                <TopBar onLogout={this.props.onLogout}
                        showPersonPanel={this.showPersonPanel}
                        closePersonPanel={this.closePersonPanel}
                        userName={this.props.username}
                        userGroup={this.props.userGroup}
                        getUserLevelName={this.getUserLevelName(userLevel)}
                        shouldShowPersonPanel={this.state.showPersonPanel}/>
                <div className="et-refresh-container">
                  <Button onClick={this.refreshTaskPage} fab color="primary" aria-label="add" className={this.props.classes.refreshButton}>
                    <RefreshIcon className={this.props.classes.refreshLabel} />
                  </Button>
                </div>
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
                {this.state.showTrainSettingView && <TrainSettingView
                  open={this.state.showTrainSettingView}
                  closeView={this.closeTrainSettingView}
                  taskType={this.state.currentTaskType}
                  currentTaskName={this.state.currentTaskName}
                  startTrain={this.startTrain} />}
                {this.state.showInputView && <NewTaskView
                  addNewTask={this.addNewTask}
                  closeView={this.closeInputView} />}
                {this.state.showDistributeTaskView && <DistriTaskView
                  distrTaskToUser={this.distrTaskToUser}
                  setCurrentUser={this.setCurrentUser}
                  closeDistributeTaskView={this.closeDistributeTaskView}
                  taskName={this.state.currentTaskName}
                  distredUserList={this.state.distredUserList}
                  distrableUserList={this.state.distrableUserList}
                  unDistributeTaskToUser={this.unDistributeTaskToUser}
                  distributeTaskToUser={this.distributeTaskToUser} />}
                {
                    this.state.showImageView === true ? (
                        <div className="popup w3-center w3-padding-64" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100', overflowY: 'auto'}}>
                            <i onClick={this.closeImageView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <select value={this.state.currentTaskStructure} onChange={this.changeTaskStructure} className="w3-select" style={{position: 'absolute', top: '10px', left: '10px', width: '130px', paddingLeft: '5px'}}>
                              {this.state.taskStructureList.map((structure, index) => (
                                <option key={structure + index}>{structure}</option>
                              ))}
                            </select>
                            <div className="w3-modal-content" style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                                <h3 className="w3-text-white">{`训练进度: ${this.state.currentProgress}%`}</h3>
                                <img className="w3-image" id="train-state"/>
                                {
                                    this.state.currentProgress === '100.0' ?
                                        !this.state.loadingTrainObjectData ?
                                        <button onClick={this.outputTrainObjectData} className="w3-button w3-orange w3-text-white w3-margin-top">输出训练模型数据</button>
                                        : <i className="fa fa-spinner w3-spin w3-xxlarge w3-text-white w3-margin-top" style={{display: 'block'}}></i>
                                    : null
                                }
                                <p style={{overflowY: 'auto', maxHeight: '550px', background: 'black', color: 'white', padding: '64px 50px', textAlign: 'left', whiteSpace: 'pre-line'}}><span style={{fontWeight: 'bold', fontSize: '22px', display: 'block'}}>LOG INFO :</span>{`${this.props.trainStateLog}`}</p>
                            </div>
                        </div>
                    ) : null
                }
                {
                    this.state.showImageViewForTrainTask === true ? (
                        <div className="popup w3-center w3-padding-64" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100', overflowY: 'auto'}}>
                            <i onClick={this.shouldShowImageViewForTrainTask} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <select value={this.state.currentTaskStructure} onChange={this.changeTaskStructureForTrainTask} className="w3-select" style={{position: 'absolute', top: '10px', left: '10px', width: '130px', paddingLeft: '5px'}}>
                              {this.state.taskStructureList.map((structure, index) => (
                                <option key={structure + index}>{structure}</option>
                              ))}
                            </select>
                            <div className="w3-modal-content" style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                                <h3 className="w3-text-white">{`训练进度: ${this.state.currentProgress}%`}</h3>
                                <img className="w3-image" id="train-state"/>
                                {
                                    this.state.currentProgress === '100.0' ?
                                        !this.state.loadingTrainObjectData ?
                                        <button onClick={this.outputTrainObjectDataForTrainTask} className="w3-button w3-orange w3-text-white w3-margin-top">输出训练模型数据</button>
                                        : <i className="fa fa-spinner w3-spin w3-xxlarge w3-text-white w3-margin-top" style={{display: 'block'}}></i>
                                    : null
                                }
                                <p style={{overflowY: 'auto', maxHeight: '550px', background: 'black', color: 'white', padding: '64px 50px', textAlign: 'left', whiteSpace: 'pre-line'}}><span style={{fontWeight: 'bold', fontSize: '22px', display: 'block'}}>LOG INFO :</span>{`${this.props.trainStateLog}`}</p>
                            </div>
                        </div>
                    ) : null
                }
                {this.state.showLabelStatisticsLoading
                  ? <div className="w3-modal" style={{display: 'flex', justifyContent: 'center', paddingTop: '300px'}}>
                    <i onClick={this.shouldShowLabelStatisticsLoading} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                    <p style={{fontSize: '4em', color: 'white'}}>统计中...</p>
                  </div>
                  : null}
                {this.state.showLabelStatisticsView === true &&
                  <div className="popup w3-center w3-padding-64" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100', overflowY: 'scroll'}}>
                      <i onClick={this.shouldShowLabelStatisticsView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <h3 className="w3-text-white">{`标注进度: ${this.state.currentTagProgress}`}</h3>
                          <div style={{overflowX: 'auto', width: '90%'}}>
                            <img src={this.state.statisticsUrl} />
                          </div>
                          <button onClick={this.outputTagData} className="w3-button w3-orange w3-text-white w3-margin-top" style={{borderRadius: '5px'}}>输出标记数据</button>
                      </div>
                  </div>}
                <div className={`et-content`}>
                  <Tabs
                    value={tabIndex}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label="任务列表" />
                    {userLevel === 3 && <Tab label="训练任务列表" />}
                    {(userLevel === 2 || userLevel === 3) && <Tab label="Worker列表" />}
                    {userLevel === 3 && <Tab label="用户管理列表" />}
                    {userLevel === 3 && <Tab label="用户组列表" />}
                    <Tab label="参数配置" />
                    <Tab label="操作日志" />
                  </Tabs>
                  <Divider />
                  {tabIndex === 0 &&
                    <TaskTable
                      getDistrableUserList={this.getDistrableUserList}
                      popupInputView={this.popupInputView}
                      taskList={this.state.taskList}
                      showDistributeTaskView={this.showDistributeTaskView}
                      onLinkToTag={this.onLinkToTag}
                      onLinkToSegment={this.onLinkToSegment}
                      onLinkToTest={this.onLinkToTest}
                      onLinkToVideo={this.onLinkToVideo}
                      onLinkToDaub={this.onLinkToDaub}
                      onLinkToPoint={this.onLinkToPoint}
                      onStartTask={this.onStartTask}
                      onStopTask={this.onStopTask}
                      onLookTrainState={this.onLookTrainState}
                      onDeleteTask={this.onDeleteTask}
                      showLabelStatistics={this.showLabelStatistics} />}
                  {(userLevel === 3 && tabIndex === 1) &&
                    <TrainTaskTable
                      ref="trainTaskList"
                      showLabelStatistics={this.showLabelStatisticsForTrainTask}
                      onStopTask={this.onStopTaskForTrainTask}
                      onLookTrainState={this.onLookTrainStateForTrainTask}
                      onDeleteTask={this.onDeleteTaskForTrainTask} />}
                  {((userLevel === 2 && tabIndex === 1) || (userLevel === 3 && tabIndex === 2)) &&
                    <WorkerTable
                      ref="workerTable"
                      workerList={this.state.workerList}
                      getWorkerStateName={this.getWorkerStateName}
                      editWorkerIndex={this.state.editWorkerIndex}
                      showEditWorkerOwner={this.state.showEditWorkerOwner}
                      workerOwnerList={this.state.workerOwnerList}
                      shouldShowEditWorkerOwner={this.shouldShowEditWorkerOwner}
                      saveWorkerOwnerChange={this.saveWorkerOwnerChange} />}
                  {(userLevel === 3 && tabIndex === 3) &&
                    <UserManageTable
                      userManageList={this.state.userManageList}
                      getUserLevelName={this.getUserLevelName}
                      deleteUser={this.deleteUser}
                      shouldShowUserManageEditView={this.shouldShowUserManageEditView} />}
                  {(userLevel === 3 && tabIndex === 4) &&
                    <UserGroupTable
                      addUserGroup={this.addUserGroup}
                      userGroupList={this.state.userGroupList}
                      deleteUserGroup={this.deleteUserGroup} />}
                  {((userLevel === 3 && tabIndex === 5) || (userLevel === 2 && tabIndex === 2) || (userLevel === 1 && tabIndex === 1) || (userLevel === 0 && tabIndex === 1)) && <GlobalSetTable />}
                  {((userLevel === 3 && tabIndex === 6) || (userLevel === 2 && tabIndex === 3) || (userLevel === 1 && tabIndex === 2) || (userLevel === 0 && tabIndex === 2)) && <OperationsTable />}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel,
  trainStateLog: appReducer.trainStateLog,
  userName: appReducer.userName,
  taskName: appReducer.taskName
})

export default withStyles(styles)(withRouter(connect(mapStateToProps)(TaskPage)));
