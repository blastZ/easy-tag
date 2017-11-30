import React, { Component } from 'react';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Toolbar from 'material-ui/Toolbar';
import FilterListIcon from 'material-ui-icons/FilterList';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
    background: '#fff',
    '& tr th': {
      textAlign: 'center',
    },
    '& tr td': {
      textAlign: 'center',
    }
  },
  paper: {
    maxWidth: 1344,
    background: 'transparent',
    boxShadow: 'none',
    padding: '0 16px'
  }
});

class DistriTaskView extends Component {
  render() {
    const { classes, showDistributeTaskView, taskName, distredUserList, distrableUserList, distributeTaskToUser, ...other } = this.props;
    return (
      <Dialog classes={{paper: classes.paper}} onRequestClose={this.props.closeDistributeTaskView} {...other}>
        <Typography type="title" style={{color: '#f1f1f1'}}>{`当前任务(${taskName})`}</Typography>
        <div style={{marginTop: '32px'}}>
          <Toolbar style={{background: '#fff'}}>
            <div className={classes.title}>
                <Typography type="subheading">已分配用户</Typography>
            </div>
          </Toolbar>
          <Divider style={{backgroundColor: '#f1f1f1'}} />
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
              {distredUserList.map((user, index) => (
                  <TableRow key={user.taskName + (Math.random() * 100000000).toFixed(0)}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell numeric>{user.level}</TableCell>
                    <TableCell numeric>{user.taskName}</TableCell>
                    <TableCell numeric>{user.tagedNum}</TableCell>
                    <TableCell numeric><i onClick={this.props.unDistributeTaskToUser.bind(this, index)} className="fa fa-calendar-times-o table-item-button" aria-hidden="true"> 取消分配</i></TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
        <Divider />
        <div style={{marginTop: '32px'}}>
          <Toolbar style={{background: '#fff'}}>
            <div className={classes.title}>
                <Typography type="subheading">可分配用户</Typography>
            </div>
          </Toolbar>
          <Divider style={{backgroundColor: '#f1f1f1'}} />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>用户名</TableCell>
                <TableCell>用户权限</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {distrableUserList.map((user, index) => (
                  <TableRow key={user.name}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell numeric>{user.level}</TableCell>
                    <TableCell numeric><i onClick={this.props.distributeTaskToUser.bind(this, index)} className="fa fa-calendar-check-o table-item-button"> 分配任务</i></TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(styles)(DistriTaskView);
