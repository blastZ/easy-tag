import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class TaskPage extends Component {
    state = {
        defaultURL: 'http://demo.codvision.com:16831/api/',
        taskList: [], //taskName: taskName, time: time, progress: progress, taskState: taskState, taskType: taskType
        userName: 'fj',
        newTaskName: 'Input the new task name.',
        showInputView: false
    }

    componentDidMount() {
        const that = this;
        const getTaskList = new XMLHttpRequest();
        try {
            getTaskList.open('GET', `${this.state.defaultURL}gettasklist?usrname=${this.state.userName}`);
            getTaskList.send();
            getTaskList.onload = function() {
                const arrayData = that.getArrayData(getTaskList.response);
                that.addTask(arrayData);
            }
        } catch(error) {
            console.log(error);
        }
    }

    popupInputView = () => {
        this.setState({showInputView: true});
    }

    closeInputView = () => {
        this.setState({showInputView: false});
    }

    onAddTask = () => {
        const that = this;
        const getNewTask = new XMLHttpRequest();
        try {
            getNewTask.open('GET', `${this.state.defaultURL}addtask?usrname=${this.state.userName}&taskname=${this.state.newTaskName}`);
            getNewTask.send();
            getNewTask.onload = function() {
                const arrayData = that.getArrayData(getNewTask.response);
                that.addTask(arrayData);
            }
        } catch(error) {
            console.log(error);
        }
    }

    addTask = (arrayData) => {
        this.setState({showInputView: false});
        const newTaskList = [];
        for(let i=0; i<arrayData.length; i=i+5) {
            const  taskName = arrayData[i].slice(4, arrayData[i].length - 1);
            const time = arrayData[i + 1].slice(3, 22);
            const progress = arrayData[i + 2].slice(1,4);
            const taskState = arrayData[i + 3].slice(1, 2);
            const taskType = arrayData[i + 4].slice(1, 2);
            newTaskList.push({taskName: taskName, time: time, progress: progress, taskState: taskState, taskType: taskType});
        }
        this.setState({taskList: newTaskList});
    }

    getArrayData = (data) => {
        data = data.split(',');
        return data;
    }

    handleInputChange = (e) => {
        this.setState({newTaskName: e.target.value})
    }

    onDeleteTask = (index) => {
        const result = window.confirm('确定删除该任务吗?');
        if(result) {
            const that = this;
            try {
                const deleteTask = new XMLHttpRequest();
                deleteTask.open('GET', `${this.state.defaultURL}deltask?usrname=${this.state.userName}&taskname=${this.state.taskList[index].taskName}`);
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
        this.props.onChangeUserAndTask(this.state.userName, this.state.taskList[index].taskName);
    }

    render() {
        return (
            <div className="w3-light-grey full-height">
                {
                    this.state.showInputView === true ? (
                        <div className="popup" style={{background: 'rgba(0, 0, 0, 0.4)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100'}}>
                            <div className="flex-box" style={{width: '40%', margin: '0 auto', position: 'absolute', top: '30%', left: '30%'}}>
                                <input onChange={this.handleInputChange} value={this.state.newTaskName} className="w3-input" type="text"/>
                                <button onClick={this.onAddTask} className="w3-button w3-orange">Add</button>
                            </div>
                        </div>
                    ) : null
                }
                <div className="w3-orange flex-box" style={{height: '80px', alignItems: 'center', position: 'relative'}}>
                    <div style={{position: 'absolute', left: '15px'}}><h3 className="w3-text-white">{this.state.userName}</h3></div>
                    <div onClick={this.popupInputView} style={{position: 'absolute', right: '32px'}}><i className="fa fa-plus-circle add-task-button" aria-hidden="true"></i></div>
                </div>
                <div className="w3-content w3-padding-64">
                    <table className="w3-table w3-bordered w3-white w3-border w3-card-2">
                        <thead className="w3-green">
                            <tr>
                                <th>ID</th>
                                <th>TASK-NAME</th>
                                <th>TIME</th>
                                <th>PROGRESS</th>
                                <th>STATE</th>
                                <th>TYPE</th>
                                <th>OPTIONS</th>
                            </tr>
                        </thead>
                        <tbody>{
                            this.state.taskList.map((task, index) => (
                                <tr key={task.taskName + index}>
                                    <td>{index + 1}</td>
                                    <td>{task.taskName}</td>
                                    <td>{task.time}</td>
                                    <td>{task.progress}</td>
                                    <td>{task.taskState}</td>
                                    <td>{task.taskType}</td>
                                    <td>
                                        <Link onClick={this.onLinkToTag.bind(this, index)} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> TAG</i></Link>
                                        <i className="fa fa-play-circle table-item-button w3-margin-left" aria-hidden="true"> TRAIN</i>
                                        <i onClick={this.onDeleteTask.bind(this, index)} className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> DELETE</i>
                                    </td>
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
