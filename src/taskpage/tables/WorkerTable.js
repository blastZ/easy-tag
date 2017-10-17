import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    currentSearchKey: 'workerName'
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

  render() {
    const { userLevel } = this.props;
    return (
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
          <h3 className="et-table-title">Worker列表</h3>
          <input className="w3-input" style={{width: '236px', borderRadius: '40px', outline: 'none', height: '100%', marginLeft: '13px', paddingLeft: '110px', paddingRight: '14px'}} value={this.state.keyword} onChange={this.handleKeyword} />
          <select value={this.state.currentSearchKey} onChange={this.handleSearchKeyChange} style={{position: 'absolute', left: '138px', borderRadius: '40px 0 0 40px', outline: 'none', height: '34px', width: '104px', paddingLeft: '15px', border: 'none', borderRight: '1px solid #f1f1f1'}}>
            {this.state.searchKey.map((key, index) => (
              <option key={key.name + index} value={key.value}>{key.name}</option>
            ))}
          </select>
        </div>
        <table ref="theWorkerTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
            <thead className="w3-green">
                <tr>
                    <th>编号</th>
                    <th>worker名称</th>
                    <th>worker状态</th>
                    <th>显卡使用情况</th>
                    <th style={{width: '9%'}}>正在服务的任务名称</th>
                    <th>更新时间</th>
                    <th>拥有者</th>
                    {
                        userLevel === 3 ?
                        <th>操作</th>
                        : null
                    }
                </tr>
            </thead>
            <tbody>{
                this.props.workerList.map((worker, index) => (
                    (new RegExp(this.state.keyword, 'i')).test(this.getTestString(worker)) &&
                    <tr key={worker.workerName + index}>
                        <td>{index + 1}</td>
                        <td>{worker.workerName}</td>
                        <td>{this.props.getWorkerStateName(worker.workerState)}</td>
                        <td>{worker.GPU}</td>
                        <td>{worker.taskName}</td>
                        <td>{worker.updateTime}</td>
                        <td>{
                            this.props.editWorkerIndex === index && this.props.showEditWorkerOwner ?
                                <select id="workerOwnerSelect">{
                                    this.props.workerOwnerList.map((owner, index) => (
                                        <option key={owner + index}>{owner}</option>
                                    ))
                                }</select>
                                : worker.owner
                        }</td>
                        {
                            userLevel === 3 ?
                            <td>{
                                !this.props.showEditWorkerOwner ?
                                <i onClick={this.props.shouldShowEditWorkerOwner.bind(this, index)} className="fa fa-address-book table-item-button"> 修改拥有者</i>
                                :<div>
                                <i onClick={this.props.saveWorkerOwnerChange.bind(this, index)} className="fa fa-minus-square table-item-button"> 保存</i>
                                <i onClick={this.props.shouldShowEditWorkerOwner.bind(this, index)} className="fa fa-minus-square table-item-button w3-margin-left"> 取消</i>
                                </div>
                            }</td>
                            : null
                        }
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

export default connect(mapStateToProps)(WorkerTable);
