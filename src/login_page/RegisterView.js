import React, { Component } from 'react';
import { DEFAULT_URL } from '../utils/global_config';

class RegisterView extends Component {
    state = {
        username: '',
        password: '',
        rePassword: '',
        email: '',
        userGroupList: []
    }

    componentDidMount() {
        this.getUserGroupList();
    }

    getUserGroupList = () => {
        const that = this;
        try {
            const request = new XMLHttpRequest();
            request.open('GET', `${DEFAULT_URL}getgrouplist`);
            request.send();
            request.onload = function() {
                console.log('get userGroupList success');
                that.getFormatUserGroupList(request.response);
            }
        } catch(error) {
            console.log(error);
        }
    }

    getFormatUserGroupList = (str) => {
        const userGroupList = [];
        const arrayData = str.split(',');
        if(arrayData.length > 0) {
            for(let i=0; i<arrayData.length; i++) {
                let groupName = '';
                if(i === arrayData.length - 1) {
                    groupName = arrayData[i].slice(3, arrayData[i].length - 2);
                } else {
                    groupName = arrayData[i].slice(3, arrayData[i].length - 1);
                }
                userGroupList.push(groupName)
            }
            this.setState({userGroupList});
        }
    }

    handleUsername = (e) => {
        let username = e.target.value;
        if(username.length > 10) {
            username = username.slice(0, 10);
        }
        this.setState({username: username});
    }

    handlePassword = (e) => {
        this.setState({password: e.target.value});
    }

    handleRePassword = (e) => {
        this.setState({rePassword: e.target.value});
    }

    handleEmail = (e) => {
        this.setState({email: e.target.value});
    }

    testEmail = () => {
        const result = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email);
        return result;
    }

    testUsername = () => {
        const result = /^[a-zA-Z0-9]+$/.test(this.state.username);
        return result;
    }

    registerVerify = () => {
        if(this.state.username === '' || this.state.username.length < 4) {
            window.alert('用户名不能为空且至少包含4个字');
        }else if(this.testUsername() === false) {
            window.alert("请输入正确的用户名")
        } else if(this.state.password === '' ||this.state.password.length < 6) {
            window.alert('密码不能为空且至少6位');
        } else if(this.state.password !== this.state.rePassword) {
            window.alert('两次输入的密码不相同');
        } else if(this.testEmail() === false) {
            window.alert('请输入正确的邮箱');
        } else {
            this.register();
        }
    }

    register = () => {
        const verifyRequest = new XMLHttpRequest();
        verifyRequest.open('POST', `${DEFAULT_URL}userreg`);
        const data = `{"name": "${this.state.username}", "email": "${this.state.email}", "passwd": "${this.state.password}", "active": 0, "level": 0, "group": "${document.getElementById('userGroup').value}"}`;
        verifyRequest.send(data);
        verifyRequest.onload = () => {
            if(verifyRequest.response === 'OK') {
                this.props.onCloseRegisterView();
            } else {
                window.alert(verifyRequest.response);
            }
        }
    }

    render() {
        return (
            <div className="popup w3-center w3-padding-64 flex-box" style={{alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1000000000'}}>
                <i onClick={this.props.onCloseRegisterView} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
                <div className="flex-box flex-column" style={{width: '20%'}}>
                    <h3 className="w3-text-white"><b>注册</b></h3>
                    <select id="userGroup" className="w3-margin-top w3-select">{
                        this.state.userGroupList.map((group, index) => (
                            <option key={group + index}>{group}</option>
                        ))
                    }</select>
                    <input onChange={this.handleUsername} value={this.state.username} className="w3-input w3-margin-top" type="text" placeholder="用户名"/>
                    <input onChange={this.handlePassword} value={this.state.password} className="w3-input w3-margin-top" type="password" placeholder="密码"/>
                    <input onChange={this.handleRePassword} value={this.state.rePassword} className="w3-input w3-margin-top" type="password" placeholder="重复密码"/>
                    <input onChange={this.handleEmail} value={this.state.email} className="w3-input w3-margin-top" type="email" placeholder="邮箱"/>
                    <button onClick={this.registerVerify} className="w3-button w3-green w3-margin-top w3-text-white"><b>注册</b></button>
                </div>
            </div>
        )
    }
}

export default RegisterView
