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
    currentSearchKey: 'userName',
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

  getIndex = (index) => {
    return (index + (this.state.page * this.state.rowsPerPage));
  }

  render() {
    const { userLevel, userManageList, classes } = this.props;
    const { page, rowsPerPage } = this.state;
    return (
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
          <h3 className="et-table-title">用户管理列表</h3>
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
                <TableCell>用户名</TableCell>
                <TableCell>邮箱</TableCell>
                <TableCell>激活状态</TableCell>
                <TableCell>用户权限</TableCell>
                <TableCell>所在组别</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userManageList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                (new RegExp(this.state.keyword, 'i')).test(this.getTestString(user)) &&
                <TableRow key={user.userName}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.activeState === '0' ? '未激活' : '已激活'}</TableCell>
                  <TableCell>{this.props.getUserLevelName(user.userLevel)}</TableCell>
                  <TableCell>{user.userGroup}</TableCell>
                  <TableCell>
                    <i onClick={this.props.deleteUser.bind(this, this.getIndex(index))} className="fa fa-minus-square table-item-button"> 删除用户</i>
                    <i onClick={this.props.shouldShowUserManageEditView.bind(this, this.getIndex(index))} className="fa fa-cog table-item-button w3-margin-left"> 编辑用户</i>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage="每页数量"
                  count={userManageList.length}
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

export default withStyles(styles)(connect(mapStateToProps)(UserManageTable));
