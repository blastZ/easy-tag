import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import AddIcon from 'material-ui-icons/Add';

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
    width: 100,
    paddingBottom: 7,
  },
});

class UserGroupTable extends Component {
  state = {
    keyword: '',
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

  render() {
    const { userLevel, userGroupList, classes } = this.props;
    const { page, rowsPerPage } = this.state;
    return (
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">用户组列表</h3>
            <Input
              style={{marginLeft: '10px'}}
              classes={{
                input: classes.input
              }}
              inputProps={{
                'aria-label': 'Description',
              }}
              value={this.state.keyword}
              onChange={this.handleKeyword} />
            <div style={{position: 'absolute', right: '5px'}}>
                <Button onClick={this.props.addUserGroup} fab color="primary" aria-label="add" className={this.props.classes.button}>
                  <AddIcon />
                </Button>
            </div>
        </div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>组名</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userGroupList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((group, index) => (
                (new RegExp(this.state.keyword, 'i')).test(group) &&
                <TableRow key={group}>
                  <TableCell>{group}</TableCell>
                  <TableCell>
                    <i onClick={this.props.deleteUserGroup.bind(this, index)} className="fa fa-minus-circle table-item-button"> 删除</i>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage="每页数量"
                  count={userGroupList.length}
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

export default withStyles(styles)(connect(mapStateToProps)(UserGroupTable));
