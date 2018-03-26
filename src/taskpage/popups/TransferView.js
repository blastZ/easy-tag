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
import { DEFAULT_URL } from '../../utils/global_config';

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
    taskList: [],
    transferTaskList: [],
    fromUserName: '',
    fromTaskName: '',
    fromTaskType: '',
    transferUserName: '',
    transferTaskName: '',
    start: 1,
    num: 0,
    isLabel: true,
    isCopy: true
  }

  componentDidMount() {
    if(this.props.userLevel === 3) {
      this.getAllUser((result) => {
        this.setState({
          userNameList: result
        })
      });
    } else {
      this.props.getDistrableUserList((result) => {
        const userNameList = result.concat({name: this.props.userName, level: this.props.userLevel});
        this.setState({
          userNameList
        })
      });
    }
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
    this.getTaskList(e.target.value, 'from');
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
    this.getTaskList(e.target.value, 'transfer');
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

  getAllUser = (cb=null) => {
    fetch(`${DEFAULT_URL}getuserlist`, {
      method: 'POST',
      body: JSON.stringify({
        name: this.props.userName,
        passwd: this.props.password
      })
    }).then((response) => response.text())
      .then((result) => {
        const userNameList = [];
        const arrayData = result.split(',');
        if(arrayData.length > 3) {
          for(let i=0; i<arrayData.length; i=i+5) {
            const userName = arrayData[i].slice(3, arrayData[i].length - 1);
            userNameList.push({
              name: userName
            })
          }
        }
        if(cb) cb(userNameList);
      })
  }

  getTaskList = (userName, type) => {
    fetch(`${DEFAULT_URL}gettasklist?usrname=${userName}`)
      .then((response) => response.text())
      .then((result) => {
        const arrayData = result.split(',');
        const taskList = [];
        if(arrayData.length > 4) {
            for(let i=0; i<arrayData.length; i=i+6) {
                const taskName = arrayData[i].slice(4, arrayData[i].length - 1);
                const taskType = arrayData[i + 4].slice(1, 2);
                taskList.push({taskName, taskType});
            }
            if(type === 'from') {
              this.setState({taskList});
            } else if(type === 'transfer') {
              this.setState({transferTaskList: taskList});
            }
        }
      })
  }

  getMaxNum = (userName, taskName) => {
    fetch(`${DEFAULT_URL}filecount?usrname=${userName}&taskname=${taskName}`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          num: result
        })
      })
  }

  sameTaskType = () => {
    const { taskList, transferTaskList, fromTaskName, transferTaskName } = this.state;
    const taskType = taskList.filter((task) => (task.taskName === fromTaskName))[0].taskType;
    const transferTaskType = transferTaskList.filter((task) => (task.taskName === transferTaskName))[0].taskType;
    if(taskType === transferTaskType) return true;
    return false;
  }

  transferData = () => {
    const { fromUserName, fromTaskName, start, num, transferUserName, transferTaskName, isLabel, isCopy} = this.state;
    if(fromUserName === '' || fromTaskName === '' || start === '' || num === '' || transferUserName === '' || transferTaskName === '') {
      window.alert('请完善信息后，再次确认。');
    } else if(isLabel && !this.sameTaskType()) {
      window.alert('任务类型不同不能复制标注数据');
    } else {
      this.props.closeView();
      fetch(`${DEFAULT_URL}transfertaskdata?`, {
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
  }

  render() {
    const { classes, closeView } = this.props;
    return (
      <Dialog onClose={closeView} open={true}>
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
                {this.state.taskList.map((task) => (
                  <MenuItem key={task.taskName} value={`${task.taskName}`}>{task.taskName}</MenuItem>
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
                {this.state.transferTaskList.map((task) => (
                  <MenuItem key={task.taskName} value={`${task.taskName}`}>{task.taskName}</MenuItem>
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
