import React, { Component } from 'react';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import List, { ListItem } from 'material-ui/List';
import { DEFAULT_URL, setParams } from '../utils/global_config';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = {
  paper: {
    width: '380px'
  }
}

class SettingView extends Component {
  state = {
    defaultUrl: DEFAULT_URL
  }

  handleRequestClose = () => {
    this.props.onClose();
  }

  handleDefaultUrl = (e) => {
    this.setState({
      defaultUrl: e.target.value.trim()
    })
  }

  changeDefaultUrl = () => {
    setParams('url', this.state.defaultURL);
    this.props.onClose();
  }

  render() {
    const { classes, ...other } = this.props;
    return (
      <Dialog classes={{paper: classes.paper}} onClose={this.handleRequestClose} {...other}>
       <DialogTitle>登录设置</DialogTitle>
       <DialogContent>
         <FormControl fullWidth>
           <InputLabel htmlFor="default-url">服务器地址</InputLabel>
           <Input
             id="default-url"
             value={this.state.defaultUrl}
             onChange={this.handleDefaultUrl}
           />
         </FormControl>
         <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
          <Button color="primary" onClick={this.handleRequestClose}>取消</Button>
          <Button color="primary" onClick={this.changeDefaultUrl}>确定</Button>
         </div>
       </DialogContent>
     </Dialog>
    )
  }
}

export default withStyles(styles)(SettingView);
