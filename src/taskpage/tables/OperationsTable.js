import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';
import { getOperationsTaskList, getOperationsCount } from '../../actions/task_action';

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
    start: 0,
    num: 20,
    pageList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentPage: 1,
    showStart: 1,
    showEnd: 10
  }

  getOperationsTaskList = () => {
    if(this.state.mode === 'current') {
      this.props.dispatch(getOperationsCount(this.props.userName));
      this.props.dispatch(getOperationsTaskList(this.props.userName, this.state.start, this.state.num));
    } else {
      this.props.dispatch(getOperationsCount('all'));
      this.props.dispatch(getOperationsTaskList('all', this.state.start, this.state.num))
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
      showStart: 1,
      showEnd: 10,
      currentPage: 1,
      start: 0,
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

  previousList = () => {
    if(this.state.currentPage > 1) {
      this.changePage(this.state.currentPage - 1);
    }
  }

  nextList = () => {
    if(this.state.currentPage < this.props.pageCount) {
      this.changePage(this.state.currentPage + 1);
    }
  }

  changePage = (page) => {
    this.setState({
      currentPage: page,
      start: ((page - 1) * this.state.num)
    }, () => {
      if(this.state.currentPage > this.state.showEnd) {
        this.setState({
          showStart: this.state.showStart + 10,
          showEnd: this.state.showEnd + 10
        })
      }
      if(this.state.currentPage < this.state.showStart) {
        this.setState({
          showStart: this.state.showStart - 10,
          showEnd: this.state.showEnd - 10
        })
      }
      this.getOperationsTaskList();
    })
  }

  render() {
    const { userLevel } = this.props;
    return(
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">操作日志</h3>
            <input className="w3-input" style={{width: '236px', borderRadius: '40px', outline: 'none', height: '100%', marginLeft: '13px', paddingLeft: '110px', paddingRight: '14px'}} value={this.state.keyword} onChange={this.handleKeyword} />
            <select value={this.state.currentSearchKey} onChange={this.handleSearchKeyChange} style={{position: 'absolute', left: '109px', borderRadius: '40px 0 0 40px', outline: 'none', height: '34px', width: '104px', paddingLeft: '15px', border: 'none', borderRight: '1px solid #f1f1f1'}}>
              {this.state.searchKey.map((key, index) => (
                <option key={key.name + index} value={key.value}>{key.name}</option>
              ))}
            </select>
            {this.props.userLevel === 3 && <div style={{position: 'absolute', right: '10px'}}>
              <span className={`et-hoverable ${this.state.mode === 'current' && 'et-font-select'}`} onClick={() => this.changeMode('current')}>当前</span>
              <span style={{margin: '0 5px'}}>/</span>
              <span className={`et-hoverable ${this.state.mode === 'all' && 'et-font-select'}`} onClick={() => this.changeMode('all')}>全部</span>
            </div>}
        </div>
        <table ref="theTaskTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered" style={{tableLayout: 'fixed'}}>
            <thead className="w3-green">
                <tr>
                    <th style={{width: '110px'}}>操作者名称</th>
                    <th>操作者IP</th>
                    <th>操作时间</th>
                    <th>操作类型</th>
                    <th>操作详细描述</th>
                </tr>
            </thead>
            <tbody>{
                this.props.operationsTaskList.map((task, index) => (
                    (new RegExp(this.state.keyword, 'i')).test(this.getTestString(task)) &&
                    <tr key={task.time + index}>
                        <td>{task.userName}</td>
                        <td>{task.ip}</td>
                        <td>{task.time}</td>
                        <td>{task.operationType}</td>
                        <td style={{whiteSpace: 'nowrap', overflowY: 'auto'}}>{task.operationDetail}</td>
                    </tr>
                ))
            }</tbody>
        </table>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '20px', alignItems: 'center'}}>
          <button className="w3-button w3-green et-change-page-button" onClick={this.previousList}>上一页</button>
          <div style={{display: 'flex', width: '50%', justifyContent: 'space-around'}}>
            {this.state.pageList.map((page) => (
              parseInt(page, 10) >= this.state.showStart && parseInt(page, 10) <= this.state.showEnd &&
              <div
                key={page}
                onClick={() => this.changePage(page)}
                className={`et-normal-index ${this.state.currentPage === parseInt(page, 10) ? 'et-selected-index' : ''}`}>{page}</div>
            ))}
          </div>
          <button className="w3-button w3-green et-change-page-button" onClick={this.nextList}>下一页</button>
        </div>
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

export default connect(mapStateToProps)(OperationsTable);
