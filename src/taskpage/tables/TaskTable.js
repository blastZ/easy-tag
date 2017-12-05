import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';
import { Color } from '../../utils/global_config';
import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import CopyIcon from 'material-ui-icons/ContentCopy';
import TransferView from '../popups/TransferView';

const styles = theme => ({
  button: {
    width: 36,
    height: 36,
    background: 'linear-gradient(to right, #5B86E5, #4788ca)'
  },
  root: {
    width: '100%'
  },
  table: {
    width: '100%',
    '& tr th': {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px'
    },
    '& tr td': {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px'
    }
  },
  select: {
    paddingBottom: 0
  },
  input: {
    width: 150,
    paddingBottom: 7
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
    currentSearchKey: 'taskName',
    page: 0,
    rowsPerPage: 5,
    showTransferView: false
  }

  closeTransferView = () => {
    this.setState({
      showTransferView: false
    })
  }

  openTransferView = () => {
    this.setState({
      showTransferView: true
    })
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

  handleChangePage = (e, page) => {
    this.setState({
      page: page
    })
  }

  handleChangeRowsPerPage = (e) => {
    this.setState({
      rowsPerPage: e.target.value
    })
  }

  getIndex = (index) => {
    return (index + (this.state.page * this.state.rowsPerPage));
  }

  render() {
    const { userLevel, classes, taskList } = this.props;
    const { page, rowsPerPage } = this.state;
    return(
      <div>
        <TransferView
          open={this.state.showTransferView}
          closeView={this.closeTransferView}
          getDistrableUserList={this.props.getDistrableUserList} />
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
          <h3 className="et-table-title">任务列表</h3>
          <Select
            style={{marginLeft: '10px'}}
            classes={{
              select: classes.select
            }}
            native
            value={this.state.currentSearchKey}
            onChange={this.handleSearchKeyChange}>
            {this.state.searchKey.map((key, index) => (
              <option key={key.name + index} value={key.value}>{key.name}</option>
            ))}
          </Select>
          <Input
            style={{marginLeft: '5px'}}
            classes={{
              input: classes.input
            }}
            inputProps={{
              'aria-label': 'Description',
            }}
            value={this.state.keyword}
            onChange={this.handleKeyword} />
          {(userLevel === 2 || userLevel === 3)
              ? <div style={{position: 'absolute', right: '0px'}}>
                <Button style={{marginRight: '10px'}} onClick={this.props.popupInputView} fab color="primary" aria-label="add" className={this.props.classes.button}>
                  <AddIcon />
                </Button>
                <Button onClick={this.openTransferView} fab color="primary" aria-label="copy" className={this.props.classes.button}>
                  <CopyIcon style={{width: '20px', height: '20px'}} />
                </Button>
              </div>
              : null}
          </div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>编号</TableCell>
                  <TableCell>任务名称</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell>任务状态</TableCell>
                  <TableCell>任务类型</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task, index) => (
                  (new RegExp(this.state.keyword, 'i')).test(this.getTestString(task)) &&
                  <TableRow key={task.taskName}>
                    <TableCell>{index + 1}</TableCell>
                    {(userLevel === 2 || userLevel === 3)
                        ? <TableCell>
                          <div className="et-taskname-button" onClick={this.props.showDistributeTaskView.bind(this, this.getIndex(index))}>{task.taskName}</div>
                        </TableCell>
                        : <TableCell>{task.taskName}</TableCell>}
                    <TableCell>{task.time}</TableCell>
                    <TableCell>{getTaskStateName(task.taskState)}</TableCell>
                    <TableCell>{getTaskTypeName(task.taskType)}</TableCell>
                    <TableCell>
                      {
                          parseInt(task.taskType) === 0 || parseInt(task.taskType) === 7 ?
                          <Link onClick={this.props.onLinkToTag.bind(this, this.getIndex(index))} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                          : null
                      }
                      {
                          parseInt(task.taskType) === 1 ?
                          <Link onClick={this.props.onLinkToTag.bind(this, this.getIndex(index))} to="/tagobject"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                          : null
                      }
                      {parseInt(task.taskType) === 2
                        ? <i onClick={this.props.onLinkToSegment.bind(this, this.getIndex(index))} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                        : null
                      }
                      {parseInt(task.taskType) === 3
                        ? <i onClick={this.props.onLinkToVideo.bind(this, this.getIndex(index))} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                        : null}
                      {parseInt(task.taskType) === 4
                        ? <i onClick={this.props.onLinkToDaub.bind(this, this.getIndex(index))} className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i>
                        : null}
                      {parseInt(task.taskType) === 5 ?
                        <Link onClick={this.props.onLinkToTag.bind(this, this.getIndex(index))} to="/tag"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                        : null}
                      {parseInt(task.taskType) === 6 ?
                        <Link onClick={this.props.onLinkToPoint.bind(this, this.getIndex(index))} to="/point"><i className="fa fa-tags table-item-button" aria-hidden="true"> 标注</i></Link>
                        : null}
                      <i onClick={this.props.showLabelStatistics.bind(this, this.getIndex(index))} className="fa fa-area-chart table-item-button w3-margin-left"> 标注统计</i>
                      {
                          (userLevel === 2 || userLevel === 3) ?
                            <i onClick={this.props.onStartTask.bind(this, this.getIndex(index))} className={`fa fa-play-circle ${task.taskState === '0' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '3' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}>{task.taskState === '3' ? ' 重新训练' : ' 开启训练'}</i>
                          : null
                      }
                      {
                          (userLevel === 2 || userLevel === 3) ?
                          <i onClick={this.props.onStopTask.bind(this, this.getIndex(index))} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 停止训练</i>
                          : null
                      }
                      {task.taskTrained ?
                        <i onClick={this.props.onLookTrainState.bind(this, this.getIndex(index))}
                            className={`fa fa-search table-item-button w3-margin-left`}> 查看训练状态</i>
                        : <i className={`fa fa-search et-silence-button w3-margin-left`}> 查看训练状态</i>}
                      {
                          (userLevel === 2 || userLevel === 3) ?
                          <Link style={{cursor: 'context-menu'}} onClick={this.props.onLinkToTest.bind(this, this.getIndex(index))} to={task.taskTrained && (parseInt(task.taskType, 10) === 0 || parseInt(task.taskType, 10) === 1) ? "/test" : "/"}>
                            <i className={`fa fa-cog ${task.taskTrained ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 测试</i>
                          </Link>
                          : null
                      }
                      {
                          (this.props.userLevel === 2 || this.props.userLevel === 3) ?
                          <i onClick={this.props.onDeleteTask.bind(this, this.getIndex(index))} className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> 删除</i>
                          : null
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    labelRowsPerPage="每页数量"
                    count={taskList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
      </div>
  )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default withStyles(styles)(connect(mapStateToProps)(TaskTable));
