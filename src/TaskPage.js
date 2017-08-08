import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class TaskPage extends Component {
    state = {
        taskList: [], //taskName: 'a', time: '2017-07-28 14:42:19', progress: '0.0', taskState: '1', taskType: '1'
        workerList: [], //workerName: 'a', workerState: '0', taskName: 'a', GPU: '2048/8192', updateTime: '2017-07-02 09:43:12'
        newTaskName: '',
        showInputView: false,
        showImageView: false,
        showPersonPanel: false
    }

    componentDidMount() {
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
                if(that.refs.theWorkerTable) {
                    that.addWorker(arrayData);
                }
            }
        } catch(error) {
            console.log(error);
        }

        window.setInterval(function() {
          that.refreshTaskPage();
        }, 60000);
    }

    popupInputView = () => {
        this.setState({showInputView: true});
    }

    closeInputView = () => {
        this.setState({showInputView: false});
    }

    closeImageView = () => {
        this.setState({showImageView: false});
    }

    onAddTask = () => {
        const that = this;
        const result = /^[a-zA-Z0-9]+$/.test(this.state.newTaskName);
        if(result === false) {
            window.alert('请输入正确的任务名');
        } else {
            const getNewTask = new XMLHttpRequest();
            try {
                getNewTask.open('GET', `${this.props.defaultURL}addtask?usrname=${this.props.username}&taskname=${this.state.newTaskName}`);
                getNewTask.send();
                getNewTask.onload = function() {
                    const arrayData = that.getArrayData(getNewTask.response);
                    that.addTask(arrayData);
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    addTask = (arrayData) => {
        console.log(arrayData);
        if(arrayData.length > 4) {
            this.setState({showInputView: false});
            const newTaskList = [];
            for(let i=0; i<arrayData.length; i=i+5) {
                const  taskName = arrayData[i].slice(4, arrayData[i].length - 1);
                const time = arrayData[i + 1].slice(3, 22);
                const progress = arrayData[i + 2].slice(1,arrayData[i + 2].length);
                const taskState = arrayData[i + 3].slice(1, 2);
                const taskType = arrayData[i + 4].slice(1, 2);
                this.getTagProgress(taskName);
                newTaskList.push({taskName: taskName, time: time,tagProgress: '0/0', progress: progress, taskState: taskState, taskType: taskType});
            }
            if(this.refs.theTaskTable) {
                this.setState({taskList: newTaskList});
            }
        }
    }

    getTagProgress = (taskName) => {
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
                console.log('getTagedFileCount success.');
                const theTagedFileCount = getTagedFileCount.response;
                const tagProgress = `${theTagedFileCount}/${theFileCount}`;
                if(that.refs.theTaskTable) {
                    that.setState((state) => {
                        state.taskList.map((task) => {
                            if(task.taskName === taskName) {
                                task.tagProgress = tagProgress;
                            }
                        })
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
        try {
            const lookTrainState = new XMLHttpRequest();
            lookTrainState.open('GET', `${this.props.defaultURL}taskinfo?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`);
            lookTrainState.send();
            lookTrainState.onload = function() {
                that.setState({showImageView: true}, function() {
                    document.getElementById('train-state').src = lookTrainState.response;
                })
            }
        } catch(error) {
            console.log(error);
        }
    }

    verifyTagProgress = (index) => {
        const str = this.state.taskList[index].tagProgress;
        const numStr = str.split('/');
        const tagedImageNum = parseInt(numStr[0]);
        const AllImageNum = parseInt(numStr[1]);
        if(tagedImageNum < 500) {
            return false;
        }
        if((tagedImageNum / AllImageNum) < 0.5) {
            return false;
        }
        return true;
    }

    onStartTask = (index) => {
        if(this.verifyTagProgress(index) === false) {
            window.alert('标注图片数量不足');
        } else {
            const that = this;
            try {
                const startTask = new XMLHttpRequest();
                startTask.open('GET', `${this.props.defaultURL}starttask?usrname=${this.props.username}&taskname=${this.state.taskList[index].taskName}`);
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

    onStopTask = (index) => {
        const that = this;
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
        this.props.onChangeUserAndTask(this.props.username, this.state.taskList[index].taskName);
    }

    getTaskStateName = (taskStateID) => {
        taskStateID = parseInt(taskStateID);
        switch (taskStateID) {
            case 0:
                return ('初始化');
            case 1:
                return ('待处理');
            case 2:
                return ('处理中');
            case 3:
                return ('处理完成');
            case 4:
                return ('出错');
        }
    }

    getTaskTypeName = (taskTypeID) => {
        taskTypeID = parseInt(taskTypeID);
        switch (taskTypeID) {
            case 0:
                return ('图片检测');
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
    }

    render() {
        return (
            <div className="w3-light-grey full-height">
                <i onClick={this.refreshTaskPage} className="fa fa-refresh et-refresh-button" aria-hidden="true"></i>
                {
                    this.state.showInputView === true ? (
                        <div className="popup" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100'}}>
                            <i onClick={this.closeInputView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                            <div className="flex-box" style={{width: '40%', margin: '0 auto', position: 'absolute', top: '30%', left: '30%'}}>
                                <select>
                                    <option>图片检测</option>
                                </select>
                                <input placeholder="输入新的任务名称" onChange={this.handleInputChange} value={this.state.newTaskName} className="w3-input" type="text"/>
                                <button onClick={this.onAddTask} className="w3-button w3-orange">添加</button>
                            </div>
                        </div>
                    ) : null
                }
                <div className="w3-orange flex-box" style={{height: '80px', alignItems: 'center', position: 'relative'}}>
                    <div style={{position: 'absolute', left: '15px'}}>
                        <div className="flex-box" style={{justifyContent: 'center', alignItems: 'center'}}>
                            <i onMouseOver={this.showPersonPanel} className="fa fa-user-circle-o w3-text-white w3-xxlarge" aria-hidden="true"></i>
                            <h3 className="w3-text-white">&nbsp;{this.props.username}</h3>
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
                            <img className="w3-image" id="train-state"/>
                        </div>
                    ) : null
                }
                <div className="et-content w3-padding-64">
                    <div style={{position: 'relative'}}>
                        <h3 className="et-margin-top-64 et-table-title">任务表</h3>
                        <div onClick={this.popupInputView} style={{position: 'absolute', right: '5px', top: '0px'}}>
                            <i className="fa fa-plus-circle add-task-button w3-text-black" aria-hidden="true"></i>
                        </div>
                    </div>
                    <table ref="theTaskTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                        <thead className="w3-green">
                            <tr>
                                <th>编号</th>
                                <th>任务名称</th>
                                <th>创建时间</th>
                                <th>标注进度</th>
                                <th>训练进度</th>
                                <th>任务状态</th>
                                <th>任务类型</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>{
                            this.state.taskList.map((task, index) => (
                                <tr key={task.taskName + index}>
                                    <td>{index + 1}</td>
                                    <td>{task.taskName}</td>
                                    <td>{task.time}</td>
                                    <td>{task.tagProgress}</td>
                                    <td>{`${task.progress}%`}</td>
                                    <td>{this.getTaskStateName(task.taskState)}</td>
                                    <td>{this.getTaskTypeName(task.taskType)}</td>
                                    <td>
                                        <Link onClick={this.onLinkToTag.bind(this, index)} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                                        <i onClick={this.onStartTask.bind(this, index)} className="fa fa-play-circle table-item-button w3-margin-left" aria-hidden="true"> 开启训练</i>
                                        <i onClick={this.onStopTask.bind(this, index)} className="fa fa-stop-circle table-item-button w3-margin-left" aria-hidden="true"> 停止训练</i>
                                        <i onClick={this.onLookTrainState.bind(this, index)} className="fa fa-search table-item-button w3-margin-left" aria-hidden="true"> 查看训练状态</i>
                                        <Link onClick={this.onLinkToTest.bind(this, index)} to="/test"><i className="fa fa-cog table-item-button w3-margin-left" aria-hidden="true"> 测试</i></Link>
                                        <i onClick={this.onDeleteTask.bind(this, index)} className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> 删除</i>
                                    </td>
                                </tr>
                            ))
                        }</tbody>
                        <tfoot></tfoot>
                    </table>
                    <h3 className="et-margin-top-64 et-table-title">Worker表</h3>
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
                </div>
            </div>
        )
    }
}

export default TaskPage
