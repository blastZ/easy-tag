import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { getTaskTypeName } from '../../utils/Task';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';

const styles = {
  button: {
    width: 150,
    marginTop: '10px',
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '5px'
  },
  paper: {
    width: 500,
    height: 331
  },
  input: {
    width: '100%',
    marginLeft: '0',
  }
};

class SetReasonView extends Component {
  state = {
    reason: '',
    index: 0
  }

  addNewReason = () => {
    if(this.state.reason !== '') {
      this.props.addNewReason(this.state.reason);
      this.setState({
        reason: ''
      })
    } else {
      window.alert('原因不能为空。');
    }
  }

  deleteReason = () => {
    if(this.props.reasonList.length === 1) {
      window.alert('至少保留一个原因。');
    } else {
      this.props.deleteReason(this.state.index);
    }
  }

  handleInput = (e) => {
    this.setState({
      reason: e.target.value.trim()
    })
  }

  handleIndex = (e) => {
    this.setState({
      index: e.target.value
    })
  }

  render() {
    const { classes, closeView, reasonList } = this.props;
    return (
      <Dialog onRequestClose={closeView} open={true} classes={{
        paper: classes.paper
      }}>
        <DialogTitle>审核不通过原因设置</DialogTitle>
        <DialogContent>
          <div>
            <FormControl style={{width: '100%'}}>
              <InputLabel htmlFor="age-simple">选择要删除的原因</InputLabel>
              <Select
                value={this.state.index}
                onChange={this.handleIndex}>
                {reasonList.map((reason, index) => (
                  <MenuItem key={reason} value={index}>{reason}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px'}}>
            <Button onClick={this.deleteReason} color="primary" raised className={classes.button}>
              删除
            </Button>
          </div>
          <div>
            <Input
              placeholder="输入新的原因"
              value={this.state.reason}
              onChange={this.handleInput}
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Button onClick={this.addNewReason} color="primary" raised className={classes.button}>
              添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(SetReasonView);
