import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';
import { getOperationsTaskList, getOperationsCount } from '../../actions/task_action';
import FirstPageIcon from 'react-icons/lib/md/skip-previous';
import LastPageIcon from 'react-icons/lib/md/skip-next';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

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
    maxWidth: '100%',
    '& tr th': {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px'
    },
    '& tr td': {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px',
      maxWidth: '800px',
      overflowX: 'auto'
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

class OperationsTable extends Component {
  state = {
    keyword: '',
    searchKey: [
      { name: '操作者名称', value: 'userName' },
      { name: '操作者IP', value: 'ip' },
      { name: '操作时间', value: 'time' },
      { name: '操作类型', value: 'operationType' },
      { name: '操作详细描述', value: 'operationDetail' },
    ],
    currentSearchKey: 'userName',
    mode: 'current',
    page: 0,
    rowsPerPage: 5,
  }

  handleChangePage = (e, page) => {
    this.setState({
      page: page
    }, () => {
      this.getOperationsTaskList();
    })
  }

  handleChangeRowsPerPage = (e) => {
    this.setState({
      rowsPerPage: e.target.value
    }, () => {
      this.getOperationsTaskList();
    })
  }

  getOperationsTaskList = () => {
    const { page, rowsPerPage } = this.state;
    if(this.state.mode === 'current') {
      this.props.dispatch(getOperationsCount(this.props.userName));
      this.props.dispatch(getOperationsTaskList(this.props.userName, page * rowsPerPage, rowsPerPage));
    } else {
      this.props.dispatch(getOperationsCount('all'));
      this.props.dispatch(getOperationsTaskList('all', page * rowsPerPage, rowsPerPage))
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.pageCount) {
      const pageList = [];
      for(let i=1; i<=nextProps.pageCount; i++) {
        pageList.push(i);
      }
      this.setState({
        pageList
      })
    }
  }

  changeMode = (mode) => {
    this.setState({
      mode,
      page: 0,
      rowsPerPage: 5
    }, () => {
      this.getOperationsTaskList();
    })
  }

  componentWillMount() {
    this.getOperationsTaskList();
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
      case 'ip': {
        return task.ip
      }
      case 'time': {
        return task.time
      }
      case 'operationType': {
        return task.operationType
      }
      case 'operationDetail': {
        return task.operationDetail
      }
    }
  }

  render() {
    const { userLevel, operationsTaskList, classes, operationsCount } = this.props;
    const { page, rowsPerPage } = this.state;
    return(
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">操作日志</h3>
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
            {this.props.userLevel === 3 && <div style={{position: 'absolute', right: '-10px', top: '13px'}}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.mode === 'current' ? false : true}
                    onChange={(event, checked) => {checked ? this.changeMode('all') : this.changeMode('current')}}
                  />
                }
                label="全部"
              />
            </div>}
        </div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>操作者名称</TableCell>
                <TableCell>操作者IP</TableCell>
                <TableCell>操作时间</TableCell>
                <TableCell>操作类型</TableCell>
                <TableCell>操作详细描述</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operationsTaskList.map((task, index) => (
                (new RegExp(this.state.keyword, 'i')).test(this.getTestString(task)) &&
                <TableRow key={task.time + index}>
                  <TableCell>{task.userName}</TableCell>
                  <TableCell>{task.ip}</TableCell>
                  <TableCell>{task.time}</TableCell>
                  <TableCell>{task.operationType}</TableCell>
                  <TableCell>{task.operationDetail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage="每页数量"
                  count={operationsCount}
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

const mapStateToProps = ({ appReducer, taskReducer }) => ({
  userLevel: appReducer.userLevel,
  operationsTaskList: taskReducer.operationsTaskList,
  userName: appReducer.userName,
  operationsCount: taskReducer.operationsCount,
  pageCount: taskReducer.pageCount
})

export default withStyles(styles)(connect(mapStateToProps)(OperationsTable));
