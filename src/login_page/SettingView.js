import React, { Component } from 'react';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import List, { ListItem } from 'material-ui/List';
import { DEFAULT_URL, setParams } from '../utils/global_config';
import { withStyles } from 'material-ui/styles';

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
    this.props.onRequestClose();
  }

  render() {
    const { classes, ...other } = this.props;
    return (
      <Dialog classes={{paper: classes.paper}} onRequestClose={this.handleRequestClose} {...other}>
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
       </DialogContent>
     </Dialog>
    )
  }
}

export default withStyles(styles)(SettingView);
