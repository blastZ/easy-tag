import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import TopBar from './TopBar'
import { getTaskStateName, getTaskTypeName, getUserLevelCode, getTaskTypeCode } from '../utils/Task';
import TrainTaskTable from './tables/TrainTaskTable';
import TaskTable from './tables/TaskTable';
import OperationsTable from './tables/OperationsTable';
import WorkerTable from './tables/WorkerTable';
import UserManageTable from './tables/UserManageTable';
import UserGroupTable from './tables/UserGroupTable';
import { connect } from 'react-redux';
import { changeTaskName, getTrainStateLog } from '../actions/app_action';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import GlobalSetTable from './tables/GlobalSetTable';
import { DEFAULT_TAGED_NUM, DEFAULT_TAGED_PROGRESS } from '../utils/global_config';
import { Color } from '../utils/global_config';
import RefreshIcon from 'material-ui-icons/Cached';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import DistriTaskView from './popups/DistriTaskView';
import NewTaskView from './popups/NewTaskView';

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
        showStartAndNumInputView: false,
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
        trainParamsForObject: {
            structure: '',
            epoch: 200,
            batchsize: 64,
            learningrate: 0.05,
            weightdecay: 0.0005,
            momentum: 0.9,
        },
        trainParams: {
            structure: '',
            epoch: 5000,
            batchsize: 32,
            learningrate: 0.0001,
            weightdecay: 0.0005,
            momentum: 0.9,
        },
        retrainChecked: false,
        structureList : [],
        structureListForObject: [],
        optimizerList: [],
        optimizerListForObject: [],
        pretrainmodelList: [],
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

    handleRetrainChecked = (e) => {
      const value = e.target.checked;
      if(value) {
        this.setState({
          retrainChecked: true
        })
      } else {
        this.setState({
          retrainChecked: false
        })
      }
    }

    handleTabChange = (tabIndex) => {
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

    shouldShowTrainSettingView = () => {
        this.setState({showTrainSettingView: !this.state.showTrainSettingView}, () => {
            if(this.state.showTrainSettingView === true) {
                const select = document.getElementById('structureSelect');
                const optimizerSelect = document.getElementById('optimizerSelect');
                const pretrainmodelSelect = document.getElementById('pretrainmodelSelect');
                if(this.state.currentTaskType === 0) {
                    if(this.state.trainParams.structure !== '') {
                        select.value = this.state.trainParams.structure;
                        optimizerSelect.value = this.state.trainParams.optimizer;
                    }
                    if(this.state.trainParams.Retrain && this.state.trainParams.Retrain === 1) {
                      pretrainmodelSelect.value = this.state.trainParams.pretrainmodel;
                    }
                } else if(this.state.currentTaskType === 1) {
                    if(this.state.trainParamsForObject.structure !== '') {
                        select.value = this.state.trainParamsForObject.structure;
                        optimizerSelect.value = this.state.trainParamsForObject.optimizer;
                    }
                    if(this.state.trainParamsForObject.Retrain && this.state.trainParamsForObject.Retrain === 1) {
                      pretrainmodelSelect.value = this.state.trainParamsForObject.pretrainmodel;
                    }
                }
                fetch(`${this.props.defaultURL}getpretrainmodel?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&structure=${select.value}`)
                  .then((response) => (response.json()))
                  .then((result) => {
                    this.setState({
                      pretrainmodelList: result
                    })
                  })
            }
        });
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
        const that = this;
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

    verifyTagProgress = (index) => {
        const that = this;
        this.getTagProgress(this.state.currentTaskName, function(){
            const str = that.state.taskList.filter((task) => (task.taskName === that.state.currentTaskName))[0].tagProgress;
            const numStr = str.split('/');
            const tagedImageNum = parseInt(numStr[0]);
            const AllImageNum = parseInt(numStr[1]);
            if(tagedImageNum < DEFAULT_TAGED_NUM) {
                window.alert(`标注图片数量不足${DEFAULT_TAGED_NUM}`);
            } else if((tagedImageNum / AllImageNum) < DEFAULT_TAGED_PROGRESS) {
                window.alert(`完成度不足${DEFAULT_TAGED_PROGRESS * 100}%`);
            } else {
                try {
                    const theValue = document.getElementById('structureSelect').value;
                    const theOptimizerValue = document.getElementById('optimizerSelect').value;
                    let thePretrainmodelValue = '';
                    if(that.state.retrainChecked) {
                      thePretrainmodelValue = document.getElementById('pretrainmodelSelect').value;
                    }
                    that.shouldShowTrainSettingView();
                    const request = new XMLHttpRequest();
                    request.open('POST', `${that.props.defaultURL}savetrainparams?usrname=${that.props.username}&taskname=${that.state.currentTaskName}`)
                    let data = '';
                    if(that.state.currentTaskType === 1) {
                        const structureList = that.state.trainParamsForObject;
                        structureList.structure = theValue;
                        structureList.optimizer = theOptimizerValue;
                        if(that.state.retrainChecked) {
                          structureList.Retrain = 1;
                          structureList.pretrainmodel = thePretrainmodelValue
                        } else {
                          structureList.Retrain = 0;
                          delete structureList.pretrainmodel
                        }
                        data = JSON.stringify(structureList);
                    } else if(that.state.currentTaskType === 0) {
                        const structureList = that.state.trainParams;
                        structureList.structure = theValue;
                        structureList.optimizer = theOptimizerValue;
                        if(that.state.retrainChecked) {
                          structureList.Retrain = 1;
                          structureList.pretrainmodel = thePretrainmodelValue
                        } else {
                          structureList.Retrain = 0;
                          delete structureList.pretrainmodel
                        }
                        data = JSON.stringify(structureList);
                    }
                    request.send(data);
                    request.onload = function() {
                        setTimeout(() => {
                          const startTask = new XMLHttpRequest();
                          startTask.open('GET', `${that.props.defaultURL}starttask?usrname=${that.props.username}&taskname=${that.state.currentTaskName}`);
                          startTask.send();
                          startTask.onload = function() {
                              const arrayData = that.getArrayData(startTask.response);
                              that.addTask(arrayData);
                          }
                        }, 1000)
                    }
                } catch(error) {
                    console.log(error);
                }
            }
        });
    }

    handleTrainSetEpoch = (e) => {
        let value = e.target.value;
        if(parseInt(this.state.currentTaskType, 10) === 0) {
            if(value.trim() === '') {
                value = 5000;
            }
            if(parseInt(value, 10) > 10000) {
                value = 10000;
            }
            if(parseInt(value, 10) <= 0) {
                value = 0;
            }
            value = parseInt(value, 10);
            this.setState({
                trainParams: {
                    ...this.state.trainParams,
                    epoch: value
                }
            })
        } else if(parseInt(this.state.currentTaskType, 10) === 1){
            if(value.trim() === '') {
                value = 200;
            }
            if(parseInt(value, 10) > 500) {
                value = 500;
            }
            if(parseInt(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParamsForObject: {
                    ...this.state.trainParamsForObject,
                    epoch: parseInt(value, 10)
                }
            })
        }
    }

    handleTrainSetBatchsize = (e) => {
        let value = e.target.value;
        if(parseInt(this.state.currentTaskType, 10) === 0) {
            if(value.trim() === '') {
                value = 32;
            }
            if(parseInt(value, 10) > 64) {
                value = 64;
            }
            if(parseInt(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParams: {
                    ...this.state.trainParams,
                    batchsize: parseInt(value, 10)
                }
            })
        } else if(parseInt(this.state.currentTaskType, 10) === 1){
            if(value.trim() === '') {
                value = 64;
            }
            if(parseInt(value, 10) > 128) {
                value = 128;
            }
            if(parseInt(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParamsForObject: {
                    ...this.state.trainParamsForObject,
                    batchsize: parseInt(value, 10)
                }
            })
        }
    }

    handleTrainSetLearningRate = (e) => {
        let value = e.target.value;
        if(parseInt(this.state.currentTaskType, 10) === 0) {
            if(value.trim() === '') {
                value = 0.0001;
            }

            if(parseFloat(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParams: {
                    ...this.state.trainParams,
                    learningrate: value
                }
            })
        } else if(parseInt(this.state.currentTaskType, 10) === 1){
            if(value.trim() === '') {
                value = 0.05;
            }

            if(parseFloat(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParamsForObject: {
                    ...this.state.trainParamsForObject,
                    learningrate: parseFloat(value)
                }
            })
        }
    }

    handleTrainSetWeightDecay = (e) => {
        let value = e.target.value;
        if(parseInt(this.state.currentTaskType, 10) === 0) {
            if(value.trim() === '') {
                value = 0.0005;
            }

            if(parseFloat(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParams: {
                    ...this.state.trainParams,
                    weightdecay: value
                }
            })
        } else if(parseInt(this.state.currentTaskType, 10) === 1){
            if(value.trim() === '') {
                value = 0.0005;
            }

            if(parseFloat(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParamsForObject: {
                    ...this.state.trainParamsForObject,
                    weightdecay: value
                }
            })
        }
    }

    handleTrainSetMomentum = (e) => {
        let value = e.target.value;
        if(parseInt(this.state.currentTaskType, 10) === 0) {
            if(value.trim() === '') {
                value = 0.9;
            }

            if(parseFloat(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParams: {
                    ...this.state.trainParams,
                    momentum: value
                }
            })
        } else if(parseInt(this.state.currentTaskType, 10) === 1){
            if(value.trim() === '') {
                value = 0.9;
            }

            if(parseFloat(value, 10) <= 0) {
                value = 0;
            }
            this.setState({
                trainParamsForObject: {
                    ...this.state.trainParamsForObject,
                    momentum: value
                }
            })
        }
    }

    onStartTask = (index) => {
        try {
          const request = new XMLHttpRequest();
          request.open('GET', `${this.props.defaultURL}gettrainparams?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`);
          request.send();
          request.onload = () => {
              this.setState({currentTaskName: this.state.taskList[index].taskName, currentTaskType: parseInt(this.state.taskList[index].taskType, 10)}, () => {
                  if(parseInt(this.state.currentTaskType, 10) === 0) {
                      fetch(`${this.props.defaultURL}getdetstructure`)
                        .then((response) => response.json())
                        .then((result) => {
                          this.setState({structureList: result}, () => {
                            this.shouldShowTrainSettingView();
                            if(request.response !== '{}') {
                                const trainParams = JSON.parse(request.response);
                                if(trainParams.Retrain && trainParams.Retrain === 1) {
                                  this.setState({retrainChecked: true})
                                } else {
                                  this.setState({retrainChecked: false})
                                }
                                this.setState({trainParams})
                            } else {
                                fetch(`${this.props.defaultURL}getdefaulttrainparams?usrname=${this.props.userName}&taskname=${this.state.currentTaskName}&structure=${this.state.structureList[0]}`)
                                  .then((response) => response.json())
                                  .then((result) => {
                                    document.getElementById('optimizerSelect').value = result.optimizer;
                                    this.setState({
                                      trainParams: {
                                        structure: result.structure,
                                        epoch: result.epoch,
                                        batchsize: result.batchsize,
                                        learningrate: parseFloat(result.learningrate, 10),
                                        weightdecay: result.weightdecay,
                                        momentum: result.momentum,
                                        optimizer: result.optimizer
                                      },
                                      retrainChecked: false
                                    })
                                  })
                            }
                          })
                          fetch(`${this.props.defaultURL}getoptmethod`)
                            .then((response) => response.json())
                            .then((result) => {
                              this.setState({optimizerList: result})
                            })
                        })
                  } else if(parseInt(this.state.currentTaskType, 10) === 1) {
                    fetch(`${this.props.defaultURL}getclsstructure`)
                      .then((response) => response.json())
                      .then((result) => {
                        this.setState({structureListForObject: result}, () => {
                          this.shouldShowTrainSettingView();
                          if(request.response !== '{}') {
                              const trainParamsForObject = JSON.parse(request.response);
                              if(trainParamsForObject.Retrain && trainParamsForObject.Retrain === 1) {
                                this.setState({retrainChecked: true})
                              } else {
                                this.setState({retrainChecked: false})
                              }
                              this.setState({trainParamsForObject})
                          } else {
                              fetch(`${this.props.defaultURL}getdefaulttrainparams?usrname=${this.props.userName}&taskname=${this.state.currentTaskName}&structure=${this.state.structureListForObject[0]}`)
                                .then((response) => response.json())
                                .then((result) => {
                                  document.getElementById('optimizerSelect').value = result.optimizer;
                                  this.setState({
                                    trainParamsForObject: {
                                      structure: result.structure,
                                      epoch: result.epoch,
                                      batchsize: result.batchsize,
                                      learningrate: parseFloat(result.learningrate, 10),
                                      weightdecay: result.weightdecay,
                                      momentum: result.momentum,
                                      optimizer: result.optimizer
                                    },
                                    retrainChecked: false
                                  })
                                })
                          }
                        })
                        fetch(`${this.props.defaultURL}getoptmethod`)
                          .then((response) => response.json())
                          .then((result) => {
                            this.setState({optimizerListForObject: result})
                          })
                      })
                  }
              })
          }
        } catch(error) {
            console.log(error);
        }

        //this.verifyTagProgress(index);
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
                this.refs.trainTaskList.getWrappedInstance().updateTrainTaskList();
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

    distributeTaskToUser = (index) => {
        const userName = this.state.distrableUserList[index].name;
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
                const distrableUserList = that.getFormatAbleUserList(request.response);
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

    changePretrainmodelList = () => {
      const theValue = document.getElementById('structureSelect').value;

      fetch(`${this.props.defaultURL}getpretrainmodel?usrname=${this.props.username}&taskname=${this.state.currentTaskName}&structure=${theValue}`)
        .then((response) => (response.json()))
        .then((result) => {
          this.setState({
            pretrainmodelList: result
          })
        })

      fetch(`${this.props.defaultURL}getdefaulttrainparams?usrname=${this.props.userName}&taskname=${this.state.currentTaskName}&structure=${theValue}`)
        .then((response) => response.json())
        .then((result) => {
          this.setState({
            trainParams: {
              structure: result.structure,
              epoch: result.epoch,
              batchsize: result.batchsize,
              learningrate: parseFloat(result.learningrate, 10),
              weightdecay: result.weightdecay,
              momentum: result.momentum,
              optimizer: result.optimizer
            },
            retrainChecked: false
          })
        })
    }

    render() {
      const { userLevel } = this.props;
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
                {
                    this.state.showTrainSettingView ?
                        <div className="popup w3-modal" style={{paddingBottom: '100px'}}>
                            <div className="w3-modal-content w3-container w3-text-white" style={{width: '600px', padding: '0px 0px 36px 0px', background: 'rgba(0, 0, 0, 0.7)', borderRadius: '10px'}}>
                                <div className="w3-container">
                                    <p>网络结构:</p>
                                    <select onChange={this.changePretrainmodelList} id="structureSelect" className="w3-select">{
                                        this.state.currentTaskType === 1 ?
                                        this.state.structureListForObject.map((item, index) => (
                                            <option key={item + index}>{item}</option>
                                        ))
                                        :
                                        this.state.structureList.map((item, index) => (
                                            <option key={item + index}>{item}</option>
                                        ))

                                    }</select>
                                </div>
                                <div className="w3-container">
                                    <p>迭代次数:</p>
                                    <input onChange={this.handleTrainSetEpoch} value={this.state.currentTaskType === 1 ? this.state.trainParamsForObject.epoch : this.state.trainParams.epoch} className="w3-input" type="number"/>
                                </div>
                                <div className="w3-container">
                                    <p>optimizer:</p>
                                    <select id="optimizerSelect" className="w3-select">{
                                        this.state.currentTaskType === 1 ?
                                        this.state.optimizerListForObject.map((item, index) => (
                                            <option key={item + index}>{item}</option>
                                        ))
                                        :
                                        this.state.optimizerList.map((item, index) => (
                                            <option key={item + index}>{item}</option>
                                        ))

                                    }</select>
                                </div>
                                <div className="w3-container">
                                    <p>batch size:</p>
                                    <input onChange={this.handleTrainSetBatchsize} value={this.state.currentTaskType === 1 ? this.state.trainParamsForObject.batchsize : this.state.trainParams.batchsize} className="w3-input" type="number"/>
                                </div>
                                <div className="w3-container">
                                    <p>learning rate:</p>
                                    <input onChange={this.handleTrainSetLearningRate} value={this.state.currentTaskType === 1 ? this.state.trainParamsForObject.learningrate : this.state.trainParams.learningrate} className="w3-input" type="number"/>
                                </div>
                                <div className="w3-container">
                                    <p>weight decay:</p>
                                    <input onChange={this.handleTrainSetWeightDecay} value={this.state.currentTaskType === 1 ? this.state.trainParamsForObject.weightdecay : this.state.trainParams.weightdecay} className="w3-input" type="number"/>
                                </div>
                                <div className="w3-container">
                                    <p>momentum:</p>
                                    <input onChange={this.handleTrainSetMomentum} value={this.state.currentTaskType === 1 ? this.state.trainParamsForObject.momentum : this.state.trainParams.momentum} className="w3-input" type="number"/>
                                </div>
                                <div className="w3-container" style={{display: 'flex', alignItems: 'center', marginTop: '16px'}}>
                                  <input style={{margin: '3px'}} type="checkbox" defaultChecked={this.state.retrainChecked} onChange={this.handleRetrainChecked} />Retrain<br />
                                </div>
                                {
                                  this.state.retrainChecked &&
                                  <div className="w3-container">
                                      <p>pretrainmodel:</p>
                                      <select id="pretrainmodelSelect" className="w3-select">{
                                        this.state.pretrainmodelList.map((item, index) => (
                                            <option key={item + index}>{item}</option>
                                        ))
                                      }</select>
                                  </div>
                                }
                                <div className="w3-container" style={{marginTop: '20px'}}>
                                    <button onClick={this.shouldShowTrainSettingView} className="w3-button w3-orange w3-left w3-text-white" style={{width: '90px', borderRadius: '5px'}}>取消</button>
                                    <button onClick={this.verifyTagProgress} className="w3-button w3-orange w3-right w3-text-white" style={{width: '90px', borderRadius: '5px'}}>确定</button>
                                </div>
                            </div>
                        </div>
                        : null
                }
                <NewTaskView
                  open={this.state.showInputView}
                  addNewTask={this.addNewTask}
                  closeView={this.closeInputView} />
                {
                    this.state.showStartAndNumInputView ? (
                        <div className="popup" style={{background: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100000'}}>
                            <i onClick={this.closeStartAndNumInputView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <div className="flex-box" style={{width: '40%', margin: '0 auto', position: 'absolute', top: '30%', left: '30%'}}>
                                <input onChange={this.handleStartInputChange} value={this.state.start} placeholder="输入起始序号" className="w3-input" type="number" style={{width: '40%'}}/>
                                <input onChange={this.handleNumInputChange} value={this.state.num} placeholder="输入图片数量" className="w3-input" type="number" style={{width: '40%', marginLeft: '2px'}}/>
                                <button onClick={this.confirmDistrTaskToUser} className="w3-button w3-orange" style={{width: '20%', marginLeft: '2px'}}>确定分配</button>
                            </div>
                        </div>
                    ) : null
                }
                <DistriTaskView
                  open={this.state.showDistributeTaskView}
                  closeDistributeTaskView={this.closeDistributeTaskView}
                  taskName={this.state.currentTaskName}
                  distredUserList={this.state.distredUserList}
                  distrableUserList={this.state.distrableUserList}
                  unDistributeTaskToUser={this.unDistributeTaskToUser}
                  distributeTaskToUser={this.distributeTaskToUser} />
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
                <div className={`et-content ${userLevel === 3 ? 'et-padding-128' : 'w3-padding-64'}`}>
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={(tabIndex) => this.handleTabChange(tabIndex)}>
                        <TabList>
                          <Tab>任务列表</Tab>
                          {userLevel === 3 &&
                            <Tab>训练任务列表</Tab>}
                          {(userLevel === 2 || userLevel === 3) &&
                            <Tab>Worker列表</Tab>}
                          {userLevel === 3 &&
                            <Tab>用户管理列表</Tab>}
                          {userLevel === 3 &&
                            <Tab>用户组列表</Tab>}
                          <Tab>参数配置</Tab>
                          <Tab>操作日志</Tab>
                        </TabList>
                        <TabPanel>
                          <TaskTable
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
                            showLabelStatistics={this.showLabelStatistics} />
                        </TabPanel>
                        {userLevel === 3 &&
                            <TabPanel>
                              <TrainTaskTable
                                ref="trainTaskList"
                                showLabelStatistics={this.showLabelStatisticsForTrainTask}
                                onStopTask={this.onStopTaskForTrainTask}
                                onLookTrainState={this.onLookTrainStateForTrainTask}
                                onDeleteTask={this.onDeleteTaskForTrainTask} />
                            </TabPanel>}
                        {(userLevel === 2 || userLevel === 3) &&
                            <TabPanel>
                              <WorkerTable
                                ref="workerTable"
                                workerList={this.state.workerList}
                                getWorkerStateName={this.getWorkerStateName}
                                editWorkerIndex={this.state.editWorkerIndex}
                                showEditWorkerOwner={this.state.showEditWorkerOwner}
                                workerOwnerList={this.state.workerOwnerList}
                                shouldShowEditWorkerOwner={this.shouldShowEditWorkerOwner}
                                saveWorkerOwnerChange={this.saveWorkerOwnerChange} />
                            </TabPanel>}
                        {userLevel === 3 &&
                            <TabPanel>
                              <UserManageTable
                                userManageList={this.state.userManageList}
                                getUserLevelName={this.getUserLevelName}
                                deleteUser={this.deleteUser}
                                shouldShowUserManageEditView={this.shouldShowUserManageEditView} />
                            </TabPanel>}
                        {userLevel === 3 &&
                            <TabPanel>
                              <UserGroupTable
                                addUserGroup={this.addUserGroup}
                                userGroupList={this.state.userGroupList}
                                deleteUserGroup={this.deleteUserGroup} />
                            </TabPanel>}
                        <TabPanel>
                          <GlobalSetTable />
                        </TabPanel>
                        <TabPanel>
                          <OperationsTable />
                        </TabPanel>
                    </Tabs>
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
