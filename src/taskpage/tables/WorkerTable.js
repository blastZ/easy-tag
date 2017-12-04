import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';

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

class WorkerTable extends Component {
  state = {
    keyword: '',
    searchKey: [
      { name: 'worker名称', value: 'workerName' },
      { name: 'worker状态', value: 'workerState' },
      { name: '显卡使用情况', value: 'GPU' },
      { name: '正在服务的任务名称', value: 'taskName' },
      { name: '更新时间', value: 'updateTime' },
      { name: '拥有者', value: 'owner' },
    ],
    currentSearchKey: 'workerName',
    page: 0,
    rowsPerPage: 5,
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

  getTestString = (worker) => {
    switch (this.state.currentSearchKey) {
      case 'workerName': {
        return worker.workerName
      }
      case 'workerState': {
        return this.props.getWorkerStateName(worker.workerState)
      }
      case 'GPU': {
        return worker.GPU
      }
      case 'taskName': {
        return worker.taskName
      }
      case 'updateTime': {
        return worker.updateTime
      }
      case 'owner': {
        return worker.owner
      }
    }
  }

  getIndex = (index) => {
    return (index + (this.state.page * this.state.rowsPerPage));
  }

  render() {
    const { userLevel, workerList, classes } = this.props;
    const { page, rowsPerPage } = this.state;
    return (
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
          <h3 className="et-table-title">Worker列表</h3>
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
                <TableCell>worker名称</TableCell>
                <TableCell>worker状态</TableCell>
                <TableCell>显卡使用情况</TableCell>
                <TableCell>正在服务的任务名称</TableCell>
                <TableCell>更新时间</TableCell>
                <TableCell>拥有者</TableCell>
                {userLevel === 3 && <TableCell>操作</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {workerList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((worker, index) => (
                (new RegExp(this.state.keyword, 'i')).test(this.getTestString(worker)) &&
                <TableRow key={worker.workerName}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{worker.workerName}</TableCell>
                  <TableCell>{this.props.getWorkerStateName(worker.workerState)}</TableCell>
                  <TableCell>{worker.GPU}</TableCell>
                  <TableCell>{worker.taskName}</TableCell>
                  <TableCell>{worker.updateTime}</TableCell>
                  <TableCell>{
                    this.props.editWorkerIndex === index && this.props.showEditWorkerOwner ?
                        <select id="workerOwnerSelect">{
                            this.props.workerOwnerList.map((owner, index) => (
                                <option key={owner + index}>{owner}</option>
                            ))
                        }</select>
                        : worker.owner
                  }</TableCell>
                  {userLevel === 3 && <TableCell>{
                    !this.props.showEditWorkerOwner ?
                      <i onClick={this.props.shouldShowEditWorkerOwner.bind(this, index)} className="fa fa-address-book table-item-button"> 修改拥有者</i>
                    :<div>
                      <i onClick={this.props.saveWorkerOwnerChange.bind(this, this.getIndex(index))} className="fa fa-minus-square table-item-button"> 保存</i>
                      <i onClick={this.props.shouldShowEditWorkerOwner.bind(this, index)} className="fa fa-minus-square table-item-button w3-margin-left"> 取消</i>
                    </div>
                  }</TableCell>}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage="每页数量"
                  count={workerList.length}
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

export default withStyles(styles)(connect(mapStateToProps)(WorkerTable));
