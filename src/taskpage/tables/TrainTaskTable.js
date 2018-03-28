import React, { Component } from 'react';
import { defaultURL, getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { connect } from 'react-redux';
import { getManagerData } from '../../actions/app_action';
import { getTrainTaskList } from '../../actions/task_action';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';

const styles = theme => ({
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

class TrainTaskTable extends Component {
    state = {
      keyword: '',
      searchKey: [
        { name: '用户名', value: 'userName' },
        { name: '任务名称', value: 'taskName' },
        { name: '创建时间', value: 'time' },
        { name: '任务状态', value: 'taskState' },
        { name: '任务类型', value: 'taskType' },
      ],
      currentSearchKey: 'userName',
      page: 0,
      rowsPerPage: 10,
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
        case 'userName': {
          return task.userName
        }
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

    getIndex = (index) => {
      return (index + (this.state.page * this.state.rowsPerPage));
    }

    render() {
        const { trainTaskList, classes } = this.props;
        const { page, rowsPerPage } = this.state;
        return (
            <div>
                <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <h3 className="et-table-title">训练任务列表</h3>
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
                </div>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>编号</TableCell>
                        <TableCell>用户名</TableCell>
                        <TableCell>任务名称</TableCell>
                        <TableCell>创建时间</TableCell>
                        <TableCell>任务状态</TableCell>
                        <TableCell>任务类型</TableCell>
                        <TableCell>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trainTaskList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task, index) => (
                        (new RegExp(this.state.keyword, 'i')).test(this.getTestString(task)) &&
                        <TableRow key={task.taskName}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{task.userName}</TableCell>
                          <TableCell>{task.taskName}</TableCell>
                          <TableCell>{task.time}</TableCell>
                          <TableCell>{getTaskStateName(task.taskState)}</TableCell>
                          <TableCell>{getTaskTypeName(task.taskType)}</TableCell>
                          <TableCell>
                            <i onClick={this.showLabelStatistics.bind(this, this.getIndex(index))} className="fa fa-area-chart table-item-button"> 标注统计</i>
                            <i onClick={this.onStopTask.bind(this, this.getIndex(index))} className={`fa fa-stop-circle ${task.taskState === '2' ? 'table-item-button' : 'et-silence-button'} ${task.taskState === '1' ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 停止训练</i>
                            <i onClick={this.onLookTrainState.bind(this, this.getIndex(index))} className={`fa fa-search ${(task.taskState === '2' || task.taskState === '3') ? 'table-item-button' : 'et-silence-button'} w3-margin-left`}> 查看训练状态</i>
                            <i onClick={this.onDeleteTask.bind(this, this.getIndex(index))} className="fa fa-trash table-item-button w3-margin-left"> 删除</i>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          labelRowsPerPage="每页数量"
                          count={trainTaskList.length}
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

const mapStateToProps = ({ taskReducer }) => ({
  trainTaskList: taskReducer.trainTaskList
})

export default withStyles(styles)(connect(mapStateToProps, null, null, { withRef: true })(TrainTaskTable));
