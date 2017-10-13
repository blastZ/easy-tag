import React, { Component } from 'react';
import { defaultURL, getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { connect } from 'react-redux';
import { getManagerData } from '../../actions/app_action';
import { getTrainTaskList } from '../../actions/task_action';

class TrainTaskTable extends Component {
    state = {
      keyword: ''
    }

    handleKeyword = (e) => {
      this.setState({
        keyword: e.target.value
      })
    }

    updateTrainTaskList = () => {
        this.getTrainTaskList();
    }

    componentDidMount() {
        this.getTrainTaskList();
    }

    getTrainTaskList = () => {
        this.props.dispatch(getManagerData());
        this.props.dispatch(getTrainTaskList());
    }

    onLookTrainState = (index) => {
        this.props.onLookTrainState(this.props.trainTaskList[index]);
    }

    showLabelStatistics = (index) => {
        this.props.showLabelStatistics(this.props.trainTaskList[index]);
    }

    onStopTask = (index) => {
        this.props.onStopTask(this.props.trainTaskList[index]);
    }

    onDeleteTask = (index) => {
        this.props.onDeleteTask(this.props.trainTaskList[index]);
    }

    render() {
        const { trainTaskList } = this.props;
        return (
            <div>
                <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <h3 className="et-table-title">训练任务列表</h3>
                  <input className="w3-input" style={{width: '200px', borderRadius: '40px', outline: 'none', height: '100%', marginLeft: '13px', paddingLeft: '14px', paddingRight: '14px'}} value={this.state.keyword} onChange={this.handleKeyword} />
                </div>
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
                            (new RegExp(this.state.keyword, 'i')).test(task.userName) &&
                            <tr key={task.taskName + index}>
                                <td>{index + 1}</td>
                                <td>{task.userName}</td>
                                <td>{task.taskName}</td>
                                <td>{task.time}</td>
                                <td>{getTaskStateName(task.taskState)}</td>
                                <td>{getTaskTypeName(task.taskType)}</td>
                                <td>
                                    <i onClick={this.showLabelStatistics.bind(this, index)} className="fa fa-area-chart table-item-button"> 标注统计</i>
                                    <i onClick={this.onStopTask.bind(this, index)} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 停止训练</i>
                                    <i onClick={this.onLookTrainState.bind(this, index)} className={`fa fa-search ${(task.taskState === '2' || task.taskState === '3') ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 查看训练状态</i>
                                    <i onClick={this.onDeleteTask.bind(this, index)} className="fa fa-trash table-item-button w3-margin-left"> 删除</i>
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = ({ taskReducer }) => ({
  trainTaskList: taskReducer.trainTaskList
})

export default connect(mapStateToProps, null, null, { withRef: true })(TrainTaskTable);
