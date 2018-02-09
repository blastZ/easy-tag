import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import UserIcon from 'material-ui-icons/AccountCircle';
import { orange, green } from 'material-ui/colors';
import HelperIcon from 'material-ui-icons/HelpOutline';
import { Color } from '../utils/global_config';
import RightMenu from '../login_page/RightMenu';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';

const styles = {
  buttonRoot: {
    color: 'white'
  },
  buttonIcon: {
    width: '1.2em',
    height: '1.2em'
  }
}


class TopBar extends Component {
  state = {
    showMenu: false
  }

  shouldShowMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  saveUserLevelLocal = () => {
    window.localStorage.setItem('userLevel', this.props.userLevel);
  }

  render() {
    const { classes } = this.props;
      return (
        <AppBar position="static" style={{background: `linear-gradient(to right, #43cea2, #185a9d)`}}>
          <RightMenu
            open={this.state.showMenu}
            closeView={this.shouldShowMenu} />
          <Toolbar>
            {this.props.shouldShowPersonPanel
              ? <div className="popup" style={{position: 'absolute', left: '10px', top: '56px'}}>
                  <button onClick={this.props.onLogout}
                    onMouseOut={this.props.closePersonPanel}
                    className="w3-button w3-black"
                    style={{borderRadius: '20px'}}>登出</button>
              </div>
              : null}
            <div style={{display: 'flex', alignItems: 'center'}}>
              <UserIcon onMouseOver={this.props.showPersonPanel} style={{marginRight: '10px', width: '33px', height: '33px'}} />
              <Typography type="title" color="inherit">
                {`${this.props.userName} - ${this.props.getUserLevelName}(${this.props.userGroup})`}
              </Typography>
            </div>
            <div style={{position: 'absolute', right: '15px'}}>
              <IconButton onClick={this.shouldShowMenu} classes={{
                root: classes.buttonRoot,
                icon: classes.buttonIcon
              }}>
                <MenuIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

      )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default withStyles(styles)(withRouter(connect(mapStateToProps)(TopBar)));
