import React, { Component } from 'react';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Toolbar from 'material-ui/Toolbar';
import FilterListIcon from 'material-ui-icons/FilterList';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import { getUserLevelName } from '../../utils/Task';
import Tabs, { Tab } from 'material-ui/Tabs';
import Select from 'material-ui/Select';

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
});

class DistriTaskView extends Component {
  state = {
    page1: 0,
    rowsPerPage1: 5,
    page2: 0,
    rowsPerPage2: 5,
    modeIndex: 0,
    currentTable: 'distred'
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

  render() {
    const { page1, page2, rowsPerPage1, rowsPerPage2 } = this.state;
    const { classes, showDistributeTaskView, taskName, distredUserList, distrableUserList, distributeTaskToUser, ...other } = this.props;
    return (
      <Dialog classes={{paper: classes.paper}} onRequestClose={this.props.closeDistributeTaskView} {...other}>
        <Tabs
          value={this.state.modeIndex}
          onChange={this.handleModeChange}
          textColor="primary"
          centered
          indicatorClassName={classes.indicator}
        >
          <Tab classes={{
            root: classes.tabRoot,
            rootPrimarySelected: classes.rootPrimarySelected
          }} label="分配任务" />
          <Tab classes={{
            root: classes.tabRoot,
            rootPrimarySelected: classes.rootPrimarySelected
          }} label="复制数据" />
        </Tabs>
        <div>
        </div>
        <div>
          <div style={{marginTop: '32px'}}>
            <Toolbar style={{background: '#fff'}}>
              <Typography type="title">{`当前任务(${taskName})`}</Typography>
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
                      <TableCell numeric><i onClick={this.props.unDistributeTaskToUser.bind(this, index)} className="fa fa-calendar-times-o table-item-button" aria-hidden="true"> 取消分配</i></TableCell>
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
                      <TableCell numeric><i onClick={this.props.distributeTaskToUser.bind(this, index)} className="fa fa-calendar-check-o table-item-button"> 分配任务</i></TableCell>
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
