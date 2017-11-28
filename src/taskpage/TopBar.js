import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import UserIcon from 'material-ui-icons/AccountCircle';
import { orange, green } from 'material-ui/colors';
import HelperIcon from 'material-ui-icons/HelpOutline';

class TopBar extends Component {
  saveUserLevelLocal = () => {
    window.localStorage.setItem('userLevel', this.props.userLevel);
  }

  render() {
      return (
        <AppBar position="static" style={{backgroundColor: `${orange[400]}`}}>
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
              <Link to="/helper/0" onClick={this.saveUserLevelLocal} target="_blank">
                <HelperIcon style={{width: '33px', height: '33px'}} />
              </Link>
            </div>
          </Toolbar>
        </AppBar>

      )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default withRouter(connect(mapStateToProps)(TopBar));
