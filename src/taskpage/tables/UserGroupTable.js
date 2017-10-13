import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserGroupTable extends Component {
  state = {
    keyword: ''
  }

  handleKeyword = (e) => {
    this.setState({
      keyword: e.target.value
    })
  }

  render() {
    const { userLevel } = this.props;
    return (
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">用户组列表</h3>
            <input className="w3-input" style={{width: '200px', borderRadius: '40px', outline: 'none', height: '100%', marginLeft: '13px', paddingLeft: '14px', paddingRight: '14px'}} value={this.state.keyword} onChange={this.handleKeyword} />
            <div style={{position: 'absolute', right: '5px'}}>
                <i onClick={this.props.addUserGroup} className="fa fa-plus-circle add-task-button w3-text-black" aria-hidden="true"></i>
            </div>
        </div>
        <table ref="theTaskTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
            <thead className="w3-green">
                <tr>
                    <th>组名</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>{
                this.props.userGroupList.map((group, index) => (
                    (new RegExp(this.state.keyword, 'i')).test(group) &&
                    <tr key={group + index}>
                        <td>{group}</td>
                        <td>
                            <i onClick={this.props.deleteUserGroup.bind(this, index)} className="fa fa-minus-circle table-item-button"> 删除</i>
                        </td>
                    </tr>
                ))
            }</tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default connect(mapStateToProps)(UserGroupTable);
