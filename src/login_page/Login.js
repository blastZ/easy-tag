import React, { Component } from 'react';
import RegisterView from './RegisterView';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import { orange, green } from 'material-ui/colors';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import HelperIcon from 'material-ui-icons/HelpOutline';
import SettingView from './SettingView';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { Color } from '../utils/global_config';

class Login extends Component {
    state = {
        username: '',
        password: '',
        showRegisterView: false,
        showSettingView: false
    }

    showRegisterView = () => {
        this.setState({showRegisterView: true});
    }

    closeRegisterView = () => {
        this.setState({showRegisterView: false});
    }

    handleUsername = (e) => {
        this.setState({username: e.target.value});
    }

    handlePassword = (e) => {
        this.setState({password: e.target.value});
    }

    loginVerify = () => {
        const that = this;
        const verifyRequest = new XMLHttpRequest();
        verifyRequest.open('POST', `${this.props.defaultURL}userlogin`);
        const data = `{"name": "${this.state.username}", "passwd": "${this.state.password}"}`;
        verifyRequest.send(data);
        verifyRequest.onload = () => {
            const jsonData = JSON.parse(verifyRequest.response);
            if(jsonData.status === 'OK') {
                this.props.onLogin(that.state.username, jsonData.level, jsonData.group, this.state.password);
            } else {
                window.alert('用户名或密码错误');
            }
        }
    }

    handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.loginVerify();
        }
    }

    showSetView = () => {
      this.setState({
        showSettingView: true
      })
    }

    closeSetView = () => {
      this.setState({
        showSettingView: false
      })
    }

    render() {
        return (
            <div className="full-height et-background-white">
                {this.state.showRegisterView
                  ? <RegisterView defaultURL={this.props.defaultURL} onCloseRegisterView={this.closeRegisterView}/>
                  : null}
                <SettingView
                  open={this.state.showSettingView}
                  onRequestClose={this.closeSetView} />
                <AppBar position="absolute" style={{background: `linear-gradient(to right, #43cea2, #185a9d)`}}>
                  <Toolbar style={{alignItems: 'center'}}>
                    <div style={{height: '65px'}}>
                      <img style={{width: '60px', height: '60px'}} src={require("../imgs/logo.png")}/>
                    </div>
                    <h2>图像智能分析系统</h2>
                    <div style={{position: 'absolute', right: '20px'}}>
                      <Link to="/helper/0" target="_blank">
                        <HelperIcon style={{width: '35px', height: '35px'}}/>
                      </Link>
                    </div>
                  </Toolbar>
                </AppBar>
                <div className="flex-box full-height" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <div onKeyPress={this.handleKeyPress} className="flex-box flex-column" style={{width: '20%'}}>
                        <h3 className="w3-center" style={{letterSpacing: '15px', color: `${Color.TEXT}`}}><b>登录</b></h3>
                        <TextField
                          label="用户名"
                          value={this.state.username}
                          onChange={this.handleUsername}
                          margin="normal"
                        />
                        <TextField
                          label="密码"
                          type="password"
                          value={this.state.password}
                          onChange={this.handlePassword}
                          margin="normal"
                        />
                        <Button raised color="primary" onClick={this.loginVerify} className="w3-margin-top" style={{background: `linear-gradient(to right, #43cea2, #185a9d)`, letterSpacing: '5px'}}>登录</Button>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <p onClick={this.showRegisterView} className="et-register-button">立即注册!</p>
                          <p onClick={this.showSetView} className="et-register-button">登录设置</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
