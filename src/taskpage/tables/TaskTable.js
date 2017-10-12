import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';

class TaskTable extends Component {
  render() {
    const { userLevel } = this.props;
    return(
      <div>
        <div style={{position: 'relative'}}>
            <h3 className="et-margin-top-32 et-table-title">任务列表</h3>
            {
                (userLevel === 2 || userLevel === 3) ?
                <div onClick={this.props.popupInputView} style={{position: 'absolute', right: '5px', top: '0px'}}>
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
                this.props.taskList.map((task, index) => (
                    <tr key={task.taskName + index}>
                        <td>{index + 1}</td>
                        {
                            (userLevel === 2 || userLevel === 3) ?
                            <td className="et-taskname-button" onClick={this.props.showDistributeTaskView.bind(this, index)}>{task.taskName}</td>
                            : <td>{task.taskName}</td>
                        }
                        <td>{task.time}</td>
                        <td>{getTaskStateName(task.taskState)}</td>
                        <td>{getTaskTypeName(task.taskType)}</td>
                        <td>
                            {
                                parseInt(task.taskType) === 0 ?
                                <Link onClick={this.props.onLinkToTag.bind(this, index)} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                                : null
                            }
                            {
                                parseInt(task.taskType) === 1 ?
                                <Link onClick={this.props.onLinkToTag.bind(this, index)} to="/tagobject"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                                : null
                            }
                            {
                                parseInt(task.taskType) === 2 ?
                                <i onClick={this.props.onLinkToSegment.bind(this, index)} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                                : null
                            }
                            <i onClick={this.props.showLabelStatistics.bind(this, index)} className="fa fa-area-chart table-item-button w3-margin-left"> 标注统计</i>
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                <i onClick={this.props.onStartTask.bind(this, index)} className={`fa fa-play-circle ${task.taskState === '0' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true">{task.taskState === '3' ? ' 重新训练' : ' 开启训练'}</i>
                                : null
                            }
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                <i onClick={this.props.onStopTask.bind(this, index)} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true"> 停止训练</i>
                                : null
                            }
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                <i onClick={this.props.onLookTrainState.bind(this, index)} className={`fa fa-search ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true"> 查看训练状态</i>
                                : null
                            }
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                <Link style={{cursor: 'context-menu'}} onClick={this.props.onLinkToTest.bind(this, index)} to={task.taskState === '3' ? "/test" : "/"}><i className={`fa fa-cog ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`} aria-hidden="true"> 测试</i></Link>
                                : null
                            }
                            {
                                (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                                <i onClick={this.props.onDeleteTask.bind(this, index)} className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> 删除</i>
                                : null
                            }
                        </td>
                    </tr>
                ))
            }</tbody>
            <tfoot></tfoot>
        </table>
      </div>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default connect(mapStateToProps)(TaskTable);
