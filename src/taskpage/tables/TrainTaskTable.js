import React, { Component } from 'react';
import { defaultURL, getTaskStateName, getTaskTypeName } from '../../utils/Task';

class TrainTaskTable extends Component {
    state = {
        trainTaskList: []
    }

    updateTrainTaskList = () => {
        this.getTrainTaskList();
    }

    componentDidMount() {
        this.getTrainTaskList();
    }

    getTrainTaskList = () => {
        try {
            const request = new XMLHttpRequest();
            request.open('POST', `${defaultURL}gettrainingtaskinfo`);
            const data = this.props.getManagerData();
            request.send(data);
            request.onload = () => {
                const arrayData = request.response.split(',');
                const trainTaskList = [];
                for(let i=0; i<arrayData.length; i=i+5) {
                    const userName = arrayData[i].slice(4, arrayData[i].length - 1);
                    const taskName = arrayData[i + 1].slice(3, arrayData[i + 1].length - 1);
                    const time = arrayData[i + 2].slice(3, arrayData[i + 2].length - 1);
                    const taskType = arrayData[i + 3].slice(1, 2);
                    const taskState = arrayData[i + 4].slice(1, 2);
                    trainTaskList.push({userName, taskName, time, taskType, taskState});
                }
                this.setState({trainTaskList});
            }
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        const { trainTaskList } = this.state;
        return (
            <div>
                <h3 className="et-margin-top-64 et-table-title">训练任务列表</h3>
                <table className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
                    <thead className="w3-green">
                        <tr>
                            <th>编号</th>
                            <th>用户名</th>
                            <th>任务名称</th>
                            <th>创建时间</th>
                            <th>任务状态</th>
                            <th>任务类型</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>{
                        trainTaskList.map((task, index) => (
                            <tr key={task.taskName + index}>
                                <td>{index + 1}</td>
                                <td>{task.userName}</td>
                                <td>{task.taskName}</td>
                                <td>{task.time}</td>
                                <td>{getTaskStateName(task.taskState)}</td>
                                <td>{getTaskTypeName(task.taskType)}</td>
                                <td>
                                    <i onClick={this.props.showLabelStatistics.bind(this, index)} className="fa fa-area-chart table-item-button w3-margin-left"> 标注统计</i>
                                    <i onClick={this.props.onStopTask.bind(this, index)} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 停止训练</i>
                                    <i onClick={this.props.onLookTrainState.bind(this, index)} className={`fa fa-search ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} table-item-button w3-margin-left`}> 查看训练状态</i>
                                    <i onClick={this.props.onDeleteTask.bind(this, index)} className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> 删除</i>
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </table>
            </div>
        )
    }
}

export default TrainTaskTable;
