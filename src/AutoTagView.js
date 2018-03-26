import React, { Component } from 'react';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { DEFAULT_URL } from './utils/global_config';

const styles = {
  paper: {
    width: 400,
    height: 255
  },
  formControl: {
    width: '100%'
  },
  button: {
    width: '100%',
    background: 'linear-gradient(to right, #43cea2, #185a9d)',
    letterSpacing: '1px',
  },
  rowButton: {
    width: '48%',
    background: 'linear-gradient(to right, #43cea2, #185a9d)',
    letterSpacing: '1px',
  }
}

class AutoTagView extends Component {
  state = {
    pretrainmodelList: [],
    pretrainmodel: '',
  }

  handleChange = (e) => {
    this.setState({
      pretrainmodel: e.target.value
    })
  }

  componentWillMount() {
    fetch(`${DEFAULT_URL}getpretrainmodelall?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
      .then((response) => (response.json()))
      .then((result) => {
        this.setState({
          pretrainmodelList: result
        })
      })
  }

  inferLabel = () => {
    fetch(`${DEFAULT_URL}inferlabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&index=${this.props.index}`)
      .then((response) => response.text())
      .then((result) => {
        this.props.inferLabel();
      })
  }

  autoTagImages = () => {
    this.props.autoTagImages(this.state.pretrainmodel);
  }

  render() {
    const { classes, open, closeView } = this.props;

    return (
      <Dialog classes={{
        paper: classes.paper
      }} open={this.props.open} onClose={this.props.closeView}>
        <DialogTitle>{"自动标注"}</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">训练模型</InputLabel>
            <Select
              value={this.state.pretrainmodel}
              onChange={this.handleChange}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.pretrainmodelList.map((pretrainmodel) => (
                <MenuItem key={pretrainmodel} value={pretrainmodel}>{pretrainmodel}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{width: '100%', marginTop: '15px'}}>
            <Button onClick={this.inferLabel} raised color="primary" className={classes.button}>
              获取上一张标注
            </Button>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '18px'}}>
            <Button onClick={this.props.closeView} raised color="primary" className={classes.rowButton}>
              取消
            </Button>
            <Button onClick={this.autoTagImages} raised color="primary" className={classes.rowButton}>
              确认
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
  taskName: appReducer.taskName
})

export default withStyles(styles)(connect(mapStateToProps)(AutoTagView));
