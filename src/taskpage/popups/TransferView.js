import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { getTaskTypeName } from '../../utils/Task';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import { FormControl, FormHelperText, FormControlLabel  } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';

const styles = {
  button: {
    width: 150,
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '5px'
  },
  formControl: {
    width: '48%'
  }
};

class TransferView extends Component {
  state = {
    userNameList: [],
    taskNameList: [],
    transferTaskNameList: [],
    fromUserName: '',
    fromTaskName: '',
    transferUserName: '',
    transferTaskName: '',
    start: 0,
    num: 0,
    isLabel: true,
    isCopy: true
  }

  componentDidMount() {
    let userNameList = this.props.getDistrableUserList((result) => {
      const userNameList = result.concat({name: this.props.userName, level: this.props.userLevel});
      this.setState({
        userNameList
      })
    });
  }

  handleIsLabel = (e) => {
    this.setState({
      isLabel: e.target.checked
    })
  }

  handleIsCopy = (e) => {
    this.setState({
      isCopy: e.target.checked
    })
  }

  handleFromUserName = (e) => {
    this.getTaskNameList(e.target.value, 'from');
    this.setState({
      fromUserName: e.target.value
    })
  }

  handleFromTaskName = (e) => {
    this.getMaxNum(this.state.fromUserName, e.target.value);
    this.setState({
      fromTaskName: e.target.value
    })
  }

  handleTransferUserName = (e) => {
    this.getTaskNameList(e.target.value, 'transfer');
    this.setState({
      transferUserName: e.target.value
    })
  }

  handleTransferTaskName = (e) => {
    this.setState({
      transferTaskName: e.target.value
    })
  }

  handleStart = (e) => {
    this.setState({
      start: e.target.value
    })
  }

  handleNum = (e) => {
    this.setState({
      num: e.target.value
    })
  }

  getTaskNameList = (userName, type) => {
    fetch(`${this.props.defaultURL}gettasklist?usrname=${userName}`)
      .then((response) => response.text())
      .then((result) => {
        const arrayData = result.split(',');
        const taskNameList = [];
        if(arrayData.length > 4) {
            for(let i=0; i<arrayData.length; i=i+6) {
                const taskName = arrayData[i].slice(4, arrayData[i].length - 1);
                taskNameList.push(taskName);
            }
            if(type === 'from') {
              this.setState({taskNameList});
            } else if(type === 'transfer') {
              this.setState({transferTaskNameList: taskNameList});
            }
        }
      })
  }

  getMaxNum = (userName, taskName) => {
    fetch(`${this.props.defaultURL}filecount?usrname=${userName}&taskname=${taskName}`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          num: result
        })
      })
  }

  transferData = () => {
    this.props.closeView();
    const { fromUserName, fromTaskName, start, num, transferUserName, transferTaskName, isLabel, isCopy} = this.state;
    fetch(`${this.props.defaultURL}transfertaskdata?`, {
      method: 'POST',
      body: JSON.stringify({
        name: this.props.userName,
        passwd: this.props.password,
        fromusrname: fromUserName,
        fromtaskname: fromTaskName,
        start: start,
        num: num,
        trasferusrname: transferUserName,
        trasfertaskname: transferTaskName,
        isLabel: isLabel ? 1 : 0,
        isCopy: isCopy ? 1: 0
      })
    }).then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
  }

  render() {
    const { classes, closeView, open } = this.props;
    return (
      <Dialog onRequestClose={closeView} open={open}>
        <DialogTitle>复制数据</DialogTitle>
        <DialogContent>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <FormControl className={classes.formControl}>
              <InputLabel>待复制任务用户名</InputLabel>
              <Select
                value={this.state.fromUserName}
                onChange={this.handleFromUserName}>
                {this.state.userNameList.map((user) => (
                  <MenuItem key={user.name} value={`${user.name}`}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>待复制任务名</InputLabel>
              <Select
                value={this.state.fromTaskName}
                onChange={this.handleFromTaskName}>
                {this.state.taskNameList.map((taskName) => (
                  <MenuItem key={taskName} value={`${taskName}`}>{taskName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop: '10px'}}>
            <Input
              type="number"
              placeholder="图像起始序号"
              value={this.state.start}
              onChange={this.handleStart}
              className={classes.input}
            />
            <Input
              type="number"
              style={{marginLeft: '10px'}}
              placeholder="图像数量"
              value={this.state.num}
              onChange={this.handleNum}
              className={classes.input}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <FormControl className={classes.formControl}>
              <InputLabel>目标用户名</InputLabel>
              <Select
                value={this.state.transferUserName}
                onChange={this.handleTransferUserName}>
                {this.state.userNameList.map((user) => (
                  <MenuItem key={user.name} value={`${user.name}`}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>目标任务名</InputLabel>
              <Select
                value={this.state.transferTaskName}
                onChange={this.handleTransferTaskName}>
                {this.state.transferTaskNameList.map((taskName) => (
                  <MenuItem key={taskName} value={`${taskName}`}>{taskName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop: '10px'}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isLabel}
                  onChange={this.handleIsLabel}
                />
              }
              label="复制标注数据"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isCopy}
                  onChange={this.handleIsCopy}
                />
              }
              label="保留原始数据"
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Button onClick={this.transferData} color="primary" raised className={classes.button}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  defaultURL: appReducer.defaultURL,
  userName: appReducer.userName,
  userLevel: appReducer.userLevel,
  password: appReducer.password
})

export default withStyles(styles)(connect(mapStateToProps)(TransferView));
