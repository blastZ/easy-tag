import React, { Component } from 'react';
import HelperIcon from 'material-ui-icons/HelpOutline';
import TestIcon from 'material-ui-icons/Extension';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

class RightMenu extends Component {
  openHelper = () => {
    window.open('/helper/0');
  }

  openTestForAll = () => {
    window.open('/testforall');
  }

  render() {
    return (
      <Drawer
         anchor="right"
         open={this.props.open}
         onRequestClose={this.props.closeView}
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

export default RightMenu;
