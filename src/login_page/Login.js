import React, { Component } from 'react';
import RegisterView from './RegisterView';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import { orange } from 'material-ui/colors';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import HelperIcon from 'react-icons/lib/md/help-outline';
import SettingView from './SettingView';

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
                <AppBar position="absolute" style={{backgroundColor: `${orange[400]}`}}>
                  <Toolbar style={{alignItems: 'center'}}>
                    <img style={{width: '60px', height: '60px', position: 'absolute'}} src={require("../imgs/logo.png")}/>
                    <h2 style={{paddingLeft: '50px'}}>&nbsp;图像智能分析系统</h2>
                    <div style={{position: 'absolute', right: '20px'}}>
                      <Link to="/helper/0" target="_blank">
                        <IconButton color="contrast" aria-label="Menu">
                          <HelperIcon style={{fontSize: '35px'}}/>
                        </IconButton>
                      </Link>
                    </div>
                  </Toolbar>
                </AppBar>
                <div className="flex-box full-height" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <div onKeyPress={this.handleKeyPress} className="flex-box flex-column" style={{width: '20%'}}>
                        <h3 className="w3-center w3-text-black"><b>登录</b></h3>
                        <input onChange={this.handleUsername} value={this.state.username} className="w3-input w3-border" type="text" placeholder="用户名"/>
                        <input onChange={this.handlePassword} value={this.state.password} className="w3-input w3-border w3-margin-top" type="password" placeholder="密码"/>
                        <button onClick={this.loginVerify} className="w3-button w3-green w3-margin-top"><b>登录</b></button>
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
