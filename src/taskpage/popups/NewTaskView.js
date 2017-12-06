import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { getTaskTypeName } from '../../utils/Task';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';

const styles = {
  button: {
    width: 150,
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '5px'
  }
};

class NewTaskView extends Component {
  state = {
    taskType: 0,
    taskName: ''
  }

  handleChange = (e) => {
    this.setState({
      taskType: e.target.value
    })
  }

  addNewTask = () => {
    this.props.addNewTask(this.state.taskType, this.state.taskName);
    this.props.closeView();
    this.setState({
      taskType: 0,
      taskName: ''
    })
  }

  handleInput = (e) => {
    this.setState({
      taskName: e.target.value.trim()
    })
  }

  render() {
    const { classes, closeView } = this.props;
    return (
      <Dialog onRequestClose={closeView} open={true}>
        <DialogTitle>新建任务</DialogTitle>
        <DialogContent>
          <div>
            <Select
              native
              value={this.state.taskType}
              onChange={this.handleChange}
            >
              <option value={0}>物体检测</option>
              <option value={1}>图片分类</option>
              <option value={2}>语义分割</option>
              <option value={3}>视频分类</option>
              <option value={4}>缺陷检测</option>
              <option value={5}>ReID检测</option>
              <option value={6}>特征点标注</option>
              <option value={7}>OCR识别</option>
            </Select>
            <Input
              style={{marginLeft: '10px'}}
              placeholder="输入新的任务名称"
              value={this.state.taskName}
              onChange={this.handleInput}
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Button onClick={this.addNewTask} color="primary" raised className={classes.button}>
              添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(NewTaskView);
