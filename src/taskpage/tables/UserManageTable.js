import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserManageTable extends Component {
  state = {
    keyword: '',
    searchKey: [
      { name: '用户名', value: 'userName' },
      { name: '邮箱', value: 'email' },
      { name: '激活状态', value: 'activeState' },
      { name: '用户权限', value: 'userLevel' },
      { name: '所在组别', value: 'userGroup' },
    ],
    currentSearchKey: 'userName'
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

  getTestString = (user) => {
    switch (this.state.currentSearchKey) {
      case 'userName': {
        return user.userName
      }
      case 'email': {
        return user.email
      }
      case 'activeState': {
        return user.activeState === '0' ? '未激活' : '已激活'
      }
      case 'userLevel': {
        return this.props.getUserLevelName(user.userLevel)
      }
      case 'userGroup': {
        return user.userGroup
      }
    }
  }

  render() {
    const { userLevel } = this.props;
    return (
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
          <h3 className="et-table-title">用户管理列表</h3>
          <input className="w3-input" style={{width: '236px', borderRadius: '40px', outline: 'none', height: '100%', marginLeft: '13px', paddingLeft: '110px', paddingRight: '14px'}} value={this.state.keyword} onChange={this.handleKeyword} />
          <select value={this.state.currentSearchKey} onChange={this.handleSearchKeyChange} style={{position: 'absolute', left: '157px', borderRadius: '40px 0 0 40px', outline: 'none', height: '34px', width: '104px', paddingLeft: '15px', border: 'none', borderRight: '1px solid #f1f1f1'}}>
            {this.state.searchKey.map((key, index) => (
              <option key={key.name + index} value={key.value}>{key.name}</option>
            ))}
          </select>
        </div>
        <table className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
            <thead className="w3-green">
                <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>激活状态</th>
                    <th>用户权限</th>
                    <th>所在组别</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>{
                this.props.userManageList.map((user, index) => (
                    (new RegExp(this.state.keyword, 'i')).test(this.getTestString(user)) &&
                    <tr key={user.userName + user.email}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.activeState === '0' ? '未激活' : '已激活'}</td>
                        <td>{this.props.getUserLevelName(user.userLevel)}</td>
                        <td>{user.userGroup}</td>
                        <td>
                            <i onClick={this.props.deleteUser.bind(this, index)} className="fa fa-minus-square table-item-button"> 删除用户</i>
                            <i onClick={this.props.shouldShowUserManageEditView.bind(this, index)} className="fa fa-cog table-item-button w3-margin-left"> 编辑用户</i>
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

export default connect(mapStateToProps)(UserManageTable);
