import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';
import { Color } from '../../utils/global_config';
import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    width: 36,
    height: 36,
    background: 'linear-gradient(to right, #5B86E5, #4788ca)'
  },
});

class TaskTable extends Component {
  state = {
    keyword: '',
    searchKey: [
      { name: '任务名称', value: 'taskName' },
      { name: '创建时间', value: 'time' },
      { name: '任务状态', value: 'taskState' },
      { name: '任务类型', value: 'taskType' },
    ],
    currentSearchKey: 'taskName'
  }

  handleKeyword = (e) => {
    this.setState({
      keyword: e.target.value
    })
  }

  handleSearchKeyChange = (e) => {
    this.setState({
      currentSearchKey: e.target.value
    })
  }

  getTestString = (task) => {
    switch (this.state.currentSearchKey) {
      case 'taskName': {
        return task.taskName
      }
      case 'time': {
        return task.time
      }
      case 'taskState': {
        return getTaskStateName(task.taskState)
      }
      case 'taskType': {
        return getTaskTypeName(task.taskType)
      }
    }
  }

  render() {
    const { userLevel } = this.props;
    return(
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">任务列表</h3>
            <input className="w3-input" style={{width: '236px', borderRadius: '40px', outline: 'none', height: '100%', marginLeft: '13px', paddingLeft: '110px', paddingRight: '14px'}} value={this.state.keyword} onChange={this.handleKeyword} />
            <select value={this.state.currentSearchKey} onChange={this.handleSearchKeyChange} style={{position: 'absolute', left: '109px', borderRadius: '40px 0 0 40px', outline: 'none', height: '34px', width: '104px', paddingLeft: '15px', border: 'none', borderRight: '1px solid #f1f1f1'}}>
              {this.state.searchKey.map((key, index) => (
                <option key={key.name + index} value={key.value}>{key.name}</option>
              ))}
            </select>
            {(userLevel === 2 || userLevel === 3)
                ? <div style={{position: 'absolute', right: '5px'}}>
                  <Button onClick={this.props.popupInputView} fab color="primary" aria-label="add" className={this.props.classes.button}>
                    <AddIcon />
                  </Button>
                </div>
                : null}
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
                    (new RegExp(this.state.keyword, 'i')).test(this.getTestString(task)) &&
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
                            {parseInt(task.taskType) === 2
                              ? <i onClick={this.props.onLinkToSegment.bind(this, index)} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                              : null
                            }
                            {parseInt(task.taskType) === 3
                              ? <i onClick={this.props.onLinkToVideo.bind(this, index)} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                              : null}
                            {parseInt(task.taskType) === 4
                              ? <i onClick={this.props.onLinkToDaub.bind(this, index)} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                              : null}
                            {parseInt(task.taskType) === 5 ?
                              <Link onClick={this.props.onLinkToTag.bind(this, index)} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                              : null}
                            {parseInt(task.taskType) === 6 ?
                              <Link onClick={this.props.onLinkToPoint.bind(this, index)} to="/point"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                              : null}
                            <i onClick={this.props.showLabelStatistics.bind(this, index)} className="fa fa-area-chart table-item-button w3-margin-left"> 标注统计</i>
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                  <i onClick={this.props.onStartTask.bind(this, index)} className={`fa fa-play-circle ${task.taskState === '0' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}>{task.taskState === '3' ? ' 重新训练' : ' 开启训练'}</i>
                                : null
                            }
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                <i onClick={this.props.onStopTask.bind(this, index)} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 停止训练</i>
                                : null
                            }
                            {task.taskTrained ?
                              <i onClick={this.props.onLookTrainState.bind(this, index)}
                                  className={`fa fa-search table-item-button w3-margin-left`}> 查看训练状态</i>
                              : <i className={`fa fa-search et-silence-button w3-margin-left`}> 查看训练状态</i>}
                            {
                                (userLevel === 2 || userLevel === 3) ?
                                <Link style={{cursor: 'context-menu'}} onClick={this.props.onLinkToTest.bind(this, index)} to={task.taskTrained && (parseInt(task.taskType, 10) === 0 || parseInt(task.taskType, 10) === 1) ? "/test" : "/"}>
                                  <i className={`fa fa-cog ${task.taskTrained ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 测试</i>
                                </Link>
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

export default withStyles(styles)(connect(mapStateToProps)(TaskTable));
