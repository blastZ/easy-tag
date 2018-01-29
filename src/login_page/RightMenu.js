import React, { Component } from 'react';
import HelperIcon from 'material-ui-icons/HelpOutline';
import TestIcon from 'material-ui-icons/Extension';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

const styles = {
  paper: {
    outline: 'none'
  }
}

class RightMenu extends Component {
  openHelper = () => {
    window.open('/helper/0');
  }

  openTestForAll = () => {
    window.open('/testforall');
  }

  render() {
    const { classes } = this.props;
    return (
      <Drawer
        classes={{
          paper: classes.paper
        }}
         anchor="right"
         open={this.props.open}
         onClose={this.props.closeView}
       >
         <List>
           <ListItem button onClick={this.openHelper}>
             <ListItemIcon>
               <HelperIcon />
             </ListItemIcon>
             <ListItemText primary="帮助文档" />
           </ListItem>
           <ListItem button onClick={this.openTestForAll}>
             <ListItemIcon>
               <TestIcon />
             </ListItemIcon>
             <ListItemText primary="Demo演示" />
           </ListItem>
         </List>
       </Drawer>
    )
  }
}

export default withStyles(styles)(RightMenu);
