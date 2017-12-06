import React, { Component } from 'react';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Toolbar from 'material-ui/Toolbar';
import FilterListIcon from 'material-ui-icons/FilterList';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import { getUserLevelName } from '../../utils/Task';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    background: '#fff',
    '& tr th': {
      textAlign: 'center',
    },
    '& tr td': {
      textAlign: 'center',
    }
  },
  paper: {
    width: '60%',
    maxWidth: 1344,
    background: 'transparent',
    boxShadow: 'none',
    padding: '0 16px'
  },
  tabRoot: {
    color: 'white'
  },
  rootPrimarySelected: {
    color: 'white'
  },
  indicator: {
    backgroundColor: '#90CAF9'
  },
  textField: {
    width: '48%'
  },
  button: {
    width: '48%',
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '1px'
  }
});

class InputView extends Component {
  state = {
    start: '',
    num: '',
  }

  handleStart = (e) => {
    let value = e.target.value;
    if(value < 1) value = 1;
    this.setState({
      start: value
    })
  }

  handleNum = (e) => {
    this.setState({
      num: e.target.value
    })
  }

  render() {
    const { classes, closeView, distrTaskToUser } = this.props;
    return (
      <Dialog open={true} onRequestClose={closeView}>
        <DialogTitle>分配任务</DialogTitle>
        <DialogContent>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <TextField
              type="number"
              label="起始序号"
              className={classes.textField}
              value={this.state.start}
              onChange={this.handleStart}
            />
            <TextField
              type="number"
              label="图片数量"
              className={classes.textField}
              value={this.state.num}
              onChange={this.handleNum}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '25px'}}>
            <Button onClick={() => distrTaskToUser(this.state.start, this.state.num)} color="primary" raised className={classes.button}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}



class DistriTaskView extends Component {
  state = {
    page1: 0,
    rowsPerPage1: 5,
    page2: 0,
    rowsPerPage2: 5,
    modeIndex: 0,
    currentTable: 'distred',
    showInputView: false,
  }

  closeInputView = () => {
    this.setState({
      showInputView: false
    })
  }

  openInputView = (index) => {
    this.props.setCurrentUser(index);
    this.setState({
      showInputView: true
    })
  }

  handleTableChange = (e) => {
    this.setState({
      currentTable: e.target.value
    })
  }

  handleModeChange = (e, value) => {
    this.setState({
      modeIndex: value
    })
  }

  handleChangePage1 = (e, page1) => {
    this.setState({
      page1
    })
  }

  handleChangePage2 = (e, page2) => {
    this.setState({
      page2
    })
  }

  handleChangeRowsPerPage1 = (e) => {
    this.setState({
      rowsPerPage1: e.target.value
    })
  }

  handleChangeRowsPerPage2 = (e) => {
    this.setState({
      rowsPerPage2: e.target.value
    })
  }

  getIndex1 = (index) => {
    return (index + (this.state.page1 * this.state.rowsPerPage1));
  }

  getIndex2 = (index) => {
    return (index + (this.state.page2 * this.state.rowsPerPage2));
  }

  distrTaskToUser = (start, num) => {
    this.props.distrTaskToUser(start, num);
    this.closeInputView();
  }

  render() {
    const { page1, page2, rowsPerPage1, rowsPerPage2 } = this.state;
    const { classes, showDistributeTaskView, taskName, distredUserList, distrableUserList, distributeTaskToUser } = this.props;
    return (
      <Dialog classes={{paper: classes.paper}} onRequestClose={this.props.closeDistributeTaskView} open={true}>
        {this.state.showInputView && <InputView
          distrTaskToUser={this.distrTaskToUser}
          classes={classes}
          closeView={this.closeInputView} />}
        <Typography style={{color: 'white'}} type="title">{`当前任务(${taskName})`}</Typography>
        <div>
        </div>
        <div>
          <div style={{marginTop: '32px'}}>
            <Toolbar style={{background: '#fff'}}>
              <div className={classes.title} style={{marginLeft: '10px'}}>
                <Select
                  native
                  value={this.state.currentTable}
                  onChange={this.handleTableChange}>
                  <option value={'distred'}>已分配用户</option>
                  <option value={'distrable'}>可分配用户</option>
                </Select>
              </div>
            </Toolbar>
            <Divider style={{backgroundColor: '#f1f1f1'}} />
            {this.state.currentTable === 'distred' &&
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>用户名</TableCell>
                  <TableCell>用户权限</TableCell>
                  <TableCell>任务名称</TableCell>
                  <TableCell>已标记张数</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {distredUserList.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1).map((user, index) => (
                    <TableRow key={user.taskName + (Math.random() * 100000000).toFixed(0)}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell numeric>{getUserLevelName(user.level)}</TableCell>
                      <TableCell numeric>{user.taskName}</TableCell>
                      <TableCell numeric>{user.tagedNum}</TableCell>
                      <TableCell numeric><i onClick={this.props.unDistributeTaskToUser.bind(this, this.getIndex1(index))} className="fa fa-calendar-times-o table-item-button" aria-hidden="true"> 取消分配</i></TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    labelRowsPerPage="每页数量"
                    count={distredUserList.length}
                    rowsPerPage={rowsPerPage1}
                    page={page1}
                    onChangePage={this.handleChangePage1}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage1}
                  />
                </TableRow>
              </TableFooter>
            </Table>}
            {this.state.currentTable === 'distrable' &&
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>用户名</TableCell>
                  <TableCell>用户权限</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {distrableUserList.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((user, index) => (
                    <TableRow key={user.name}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell numeric>{getUserLevelName(user.level)}</TableCell>
                      <TableCell numeric><i onClick={() => this.openInputView(this.getIndex2(index))} className="fa fa-calendar-check-o table-item-button"> 分配任务</i></TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    labelRowsPerPage="每页数量"
                    count={distrableUserList.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onChangePage={this.handleChangePage2}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage2}
                  />
                </TableRow>
              </TableFooter>
            </Table>}
          </div>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(styles)(DistriTaskView);
