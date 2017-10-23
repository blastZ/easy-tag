import React, { Component } from 'react'
import './css/App.css'
import './css/w3.css'
import $ from 'jquery'
import './css/font-awesome.min.css'
import SelectBar from './SelectBar.js'
import SelectedImage from './SelectedImage.js'
import TagView from './TagView.js'
import SelectedObjectImage from './SelectedObjectImage';
import TagObjectView from './TagObjectView';
import TaskPage from './taskpage/TaskPage'
import { Route, withRouter } from 'react-router-dom'
import Demo from './test_page/Demo';
import Login from './login_page/Login';
import SegmentView from './segment_page/SegmentView';
import { changeUserName, changeUserLevel, changeTaskName, changePassword, autoTagImages } from './actions/app_action';
import { connect } from 'react-redux';
import Helper from './helper_page/Helper';
import VideoView from './video_page/VideoView';
//import { saveAs } from 'file-saver' when you want to save as txt on the localhost

class App extends Component {
    state = {
        userName: '',
        taskName: '',
        userLevel: 0,
        userGroup: '',
        password: '',
        defaultURL: 'http://demo.codvision.com:16831/api/',
        imageList: [
            //{url: 'http://demo.codvision.com:16831/static/user/fj/task1/data/zhong1_12.jpg', name: 'ding1_6.jpg', labeled: 0}
        ],
        tagList: [
            // {x_start: 0, y_start: 0, x_end: 10, y_end: 20, tag: ['car', 'white'], info: '浙F1234567'} result format
        ],
        currentTagString: '1',
        selectedImageNum: 0,
        start: 1,
        num: 10,
        complete: 0,
        login: false,
        shouldPostTagList: false,
        shouldPostObjectTagList: false,
        currentBrowserMode: 'normal' //'normal', 'find'
    }

    uploadImageFiles = (files) => {
        const that = this;
        for(const file of files) {
            if(!file.type.match('image.*')) {
                continue;
            }
            const formData = new FormData();
            formData.append("file", file);
            const fileRequest = new XMLHttpRequest();
            fileRequest.open('POST', `${that.state.defaultURL}uploadfile?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${file.name}`);
            fileRequest.send(formData);
            fileRequest.onload = function() {
                console.log('post image success.');
                if(that.refs.tagRoute.refs.selectedImage) {
                    that.refs.tagRoute.refs.selectedImage.getFileCount();
                    that.refs.tagRoute.refs.selectedImage.getTagedFileCount();
                }
                if(that.refs.tagObjectRoute.refs.selectedObjectImage) {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.getFileCount();
                    that.refs.tagObjectRoute.refs.selectedObjectImage.getTagedFileCount();
                }
            }
            fileRequest.onerror = function() {
                console.log('post image failed.');
            }
        }

    }

    getImageListByTag = () => {
        this.setState({selectedImageNum: 0, tagList: []});
        const that = this;
        //load imageList from server
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${this.state.start}&num=${this.state.num}`);
        const data = JSON.stringify({
            tag: this.state.currentTagString
        })
        xhr.send(data);
        xhr.onload = function() {
            console.log('getImageList by tag success');
            const newImageList = [];
            if(xhr.response) {
                const jsonResponse = JSON.parse(xhr.response);
                jsonResponse.map((image) => {
                    newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                })
            }
            that.setState({imageList: newImageList}, () => {
                that.getTagList(0)
            });
        }
        xhr.onerror = function() {
            console.log('get imageList by tag failed');
            that.getTagList(0);
        }
    }

    getImageList = () => {
        this.setState({selectedImageNum: 0, tagList: []});
        const that = this;
        //load imageList from server
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${this.state.start}&num=${this.state.num}`);
        xhr.onload = function() {
            console.log('getImageList success');
            const newImageList = [];
            if(xhr.response) {
                const jsonResponse = JSON.parse(xhr.response);
                jsonResponse.map((image) => {
                    newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                })
            }
            that.setState({imageList: newImageList}, () => {
                that.getTagList(0)
            });
        }
        xhr.onerror = function() {
            console.log('get imageList failed');
            that.getTagList(0);
        }
        xhr.send();
    }

    nextImageList = () => {
        this.saveTagList(this.state.selectedImageNum);
        const that = this;
        let maxValue = 0;
        if(that.refs.tagRoute && that.refs.tagRoute.refs.selectedImage) {
            maxValue = that.refs.tagRoute.refs.selectedImage.state.fileCount;
        }
        if(this.state.currentBrowserMode === 'normal') {
            //load imageList from server
            const xhr = new XMLHttpRequest();
            //it is doesn't matter send a number larger than the maxValue, server side will detect it
            xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            xhr.onload = function() {
                console.log('getNextList success');
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                })
                that.getTagList(0);
            }
            xhr.onerror = function() {
                console.log('getNextList failed');
                that.getTagList(0);
            }
            xhr.send();
        } else if(this.state.currentBrowserMode === 'find') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.state.currentTagString
            })
            xhr.send(data);
            xhr.onload = function() {
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                })
                that.getTagList(0);
            }
        }

    }

    nextImageListForObject = () => {
        this.saveObjectTagList(this.state.selectedImageNum);
        const that = this;
        let maxValue = 0;
        if(that.refs.tagObjectRoute && that.refs.tagObjectRoute.refs.selectedObjectImage) {
            maxValue = that.refs.tagObjectRoute.refs.selectedObjectImage.state.fileCount;
        }
        if(this.state.currentBrowserMode === 'normal') {
            //load imageList from server
            const xhr = new XMLHttpRequest();
            //it is doesn't matter send a number larger than the maxValue, server side will detect it
            xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            xhr.onload = function() {
                console.log('getNextList success');
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                })
                that.getTagList(0);
            }
            xhr.onerror = function() {
                console.log('getNextList failed');
                that.getTagList(0);
            }
            xhr.send();
        } else if(this.state.currentBrowserMode === 'find') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.state.currentTagString
            })
            xhr.send(data);
            xhr.onload = function() {
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                })
                that.getTagList(0);
            }
        }
    }

    previousImageList = () => {
        const that = this;
        this.saveTagList(this.state.selectedImageNum);
        if(this.state.currentBrowserMode === 'normal') {
            //load imageList from server
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            xhr.onload = function() {
                console.log('getNextList success');
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                })
                that.getTagList(0);
            }
            xhr.onerror = function() {
                console.log('getNextList failed');
                that.getTagList(0);
            }
            xhr.send();
        } else if(this.state.currentBrowserMode === 'find') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.state.currentTagString
            })
            xhr.send(data);
            xhr.onload = function() {
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                })
                that.getTagList(0);
            }
        }
    }

    previousImageListForObject = () => {
        const that = this;
        this.saveObjectTagList(this.state.selectedImageNum);
        if(this.state.currentBrowserMode === 'normal') {
            //load imageList from server
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            xhr.onload = function() {
                console.log('getNextList success');
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                })
                that.getTagList(0);
            }
            xhr.onerror = function() {
                console.log('getNextList failed');
                that.getTagList(0);
            }
            xhr.send();
        } else if(this.state.currentBrowserMode === 'find') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.state.currentTagString
            })
            xhr.send(data);
            xhr.onload = function() {
                const newImageList = [];
                if(xhr.response) {
                    const jsonResponse = JSON.parse(xhr.response);
                    jsonResponse.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                    })
                }
                that.setState((state) => {
                    state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                })
                that.getTagList(0);
            }
        }
    }

    previousImageListForShortcut = () => {
        this.saveTagList(this.state.selectedImageNum);
        const that = this;
        //load imageList from server
        if(this.state.start === 1 && this.state.selectedImageNum === 0) {

        } else {
            if(this.state.currentBrowserMode === 'normal') {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const newImageList = [];
                    xhr.onload = function() {
                        console.log('getNextList success');
                        if(xhr.response) {
                            const jsonResponse = JSON.parse(xhr.response);
                            jsonResponse.map((image) => {
                                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                            })
                        }
                        that.setState((state) => {
                            state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                            state.selectedImageNum = newImageList.length - 1;
                            state.tagList = [];
                            state.imageList = newImageList;
                        }, function() {
                            that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                        })
                        that.getTagList(newImageList.length - 1);
                    }
                    xhr.onerror = function() {
                        console.log('getNextList failed');
                        that.getTagList(newImageList.length - 1);
                    }
                    xhr.send();
                } catch(error) {
                    console.log(error);
                }
            } else if(this.state.currentBrowserMode === 'find') {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const data = JSON.stringify({
                        tag: this.state.currentTagString
                    })
                    xhr.send(data);
                    const newImageList = [];
                    xhr.onload = function() {
                        console.log('getNextList success');
                        if(xhr.response) {
                            const jsonResponse = JSON.parse(xhr.response);
                            jsonResponse.map((image) => {
                                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                            })
                        }
                        that.setState((state) => {
                            state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                            state.selectedImageNum = newImageList.length - 1;
                            state.tagList = [];
                            state.imageList = newImageList;
                        }, function() {
                            that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                        })
                        that.getTagList(newImageList.length - 1);
                    }
                } catch(error) {
                    console.log(error);
                }
            }
        }
    }

    previousImageListForShortcutForObject = () => {
        this.saveObjectTagList(this.state.selectedImageNum);
        const that = this;
        //load imageList from server
        if(this.state.start === 1 && this.state.selectedImageNum === 0) {

        } else {
            if(this.state.currentBrowserMode === 'normal') {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', `${that.state.defaultURL}getdir?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const newImageList = [];
                    xhr.onload = function() {
                        console.log('getNextList success');
                        if(xhr.response) {
                            const jsonResponse = JSON.parse(xhr.response);
                            jsonResponse.map((image) => {
                                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                            })
                        }
                        that.setState((state) => {
                            state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                            state.selectedImageNum = newImageList.length - 1;
                            state.tagList = [];
                            state.imageList = newImageList;
                        }, function() {
                            that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                        })
                        that.getTagList(newImageList.length - 1);
                    }
                    xhr.onerror = function() {
                        console.log('getNextList failed');
                        that.getTagList(newImageList.length - 1);
                    }
                    xhr.send();
                } catch(error) {
                    console.log(error);
                }
            } else if(this.state.currentBrowserMode === 'find') {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `${that.state.defaultURL}getdirwithtag?usrname=${this.state.userName}&taskname=${this.state.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const data = JSON.stringify({
                        tag: this.state.currentTagString
                    })
                    xhr.send(data);
                    const newImageList = [];
                    xhr.onload = function() {
                        console.log('getNextList success');
                        if(xhr.response) {
                            const jsonResponse = JSON.parse(xhr.response);
                            jsonResponse.map((image) => {
                                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                            })
                        }
                        that.setState((state) => {
                            state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                            state.selectedImageNum = newImageList.length - 1;
                            state.tagList = [];
                            state.imageList = newImageList;
                        }, function() {
                            that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                        })
                        that.getTagList(newImageList.length - 1);
                    }
                } catch(error) {
                    console.log(error);
                }
            }
        }
    }

    deleteImage = () => {
        const that = this;
        const result = window.confirm("确定删除这张图片吗?");
        if(result) {
            if(this.state.selectedImageNum !== 0) {
                //delete image from server
                const deleteRequest = new XMLHttpRequest();
                deleteRequest.open('GET', `${that.state.defaultURL}delfile?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${this.state.imageList[this.state.selectedImageNum].name}`);
                deleteRequest.send();
                //delete image from imageList
                this.setState((state) => {
                    state.imageList.splice(state.selectedImageNum, 1);
                    state.selectedImageNum = state.selectedImageNum - 1;
                })
            } else {
                //select the first one
                if(this.state.imageList.length > 0) {
                    //delete image from server
                    const deleteRequest = new XMLHttpRequest();
                    deleteRequest.open('GET', `${that.state.defaultURL}delfile?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${this.state.imageList[this.state.selectedImageNum].name}`);
                    deleteRequest.send();
                    //delete image from imageList
                    this.setState((state) => {
                        state.imageList.splice(state.selectedImageNum, 1);
                        state.selectedImageNum = 0;
                    })
                }
            }
            if(that.refs.tagRoute.refs.selectedImage) {
                that.refs.tagRoute.refs.selectedImage.getFileCount();
                that.refs.tagRoute.refs.selectedImage.getTagedFileCount();
            }
            if(that.refs.tagObjectRoute.refs.selectedObjectImage) {
                that.refs.tagObjectRoute.refs.selectedObjectImage.getFileCount();
                that.refs.tagObjectRoute.refs.selectedObjectImage.getTagedFileCount();
            }

        }
    }

    concatNewImage = (url, name) => {
        return (preState) => {
            return {
                imageList: preState.imageList.concat([{url: url, name: name}])
            };
        };
    }

    nextImage = () => {
        const that = this, preIndex = this.state.selectedImageNum;
        if(preIndex + 1 < this.state.imageList.length) {
            this.setState((state) => {
                state.selectedImageNum = preIndex + 1;
                that.saveTagList(preIndex);
                that.getTagList(preIndex + 1);
            }, function() {
                that.refs.tagRoute.refs.selectedImage.initSelectedImage();
            })
        } else if(preIndex + 1 === this.state.imageList.length) {
            this.nextImageList();
        }
    }

    nextImageForObject = () => {
        const that = this, preIndex = this.state.selectedImageNum;
        if(preIndex + 1 < this.state.imageList.length) {
            this.setState((state) => {
                state.selectedImageNum = preIndex + 1;
                that.saveObjectTagList(preIndex);
                that.getTagList(preIndex + 1);
            }, function() {
                that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
            })
        } else if(preIndex + 1 === this.state.imageList.length) {
            this.nextImageListForObject();
        }
    }

    previousImage = () => {
        const that = this, preIndex = this.state.selectedImageNum;
        if(preIndex - 1 >= 0) {
            this.setState((state) => {
                state.selectedImageNum = preIndex - 1;
                that.saveTagList(preIndex);
                that.getTagList(preIndex - 1);
            }, function() {
                that.refs.tagRoute.refs.selectedImage.initSelectedImage();
            })
        } else {
            this.previousImageListForShortcut();
        }
    }

    previousImageForObject = () => {
        const that = this, preIndex = this.state.selectedImageNum;
        if(preIndex - 1 >= 0) {
            this.setState((state) => {
                state.selectedImageNum = preIndex - 1;
                that.saveObjectTagList(preIndex);
                that.getTagList(preIndex - 1);
            }, function() {
                that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
            })
        } else {
            this.previousImageListForShortcutForObject();
        }
    }

    clickItem = (url) => {
        const preIndex = this.state.selectedImageNum;
        const that = this;
        for(let i=0; i<this.state.imageList.length; i++) {
            if(this.state.imageList[i].url === url) {
                this.setState((state) => {
                    state.selectedImageNum = i
                    if(preIndex !== i) {
                        that.saveTagList(preIndex);
                        that.getTagList(i);
                    }
                    if(state.imageList.length === 1) {
                        that.saveTagList(preIndex);
                    }
                }, function() {
                    that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                    that.refs.tagRoute.refs.tagView.changeAutoTagStart(that.state.selectedImageNum + that.state.start);
                })
                break
            }
        }
    }

    clickObjectItem = (url) => {
        const preIndex = this.state.selectedImageNum;
        const that = this;
        for(let i=0; i<this.state.imageList.length; i++) {
            if(this.state.imageList[i].url === url) {
                this.setState((state) => {
                    state.selectedImageNum = i
                    if(preIndex !== i) {
                        that.saveObjectTagList(preIndex);
                        that.getTagList(i);
                    }
                    if(state.imageList.length === 1) {
                        that.saveObjectTagList(preIndex);
                    }
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                    that.refs.tagObjectRoute.refs.tagObjectView.changeAutoTagStart(that.state.selectedImageNum + that.state.start);
                })
                break
            }
        }
    }

    getTagList = (index) => {
        const that = this;
        let tagList = [];
        try {
            const tagListRequest = new XMLHttpRequest();
            tagListRequest.open('GET',
            encodeURI(`${that.state.defaultURL}loadlabel?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${this.state.imageList[index].name}`));
            tagListRequest.send();
            tagListRequest.onload = function() {
                const jsonResponse = JSON.parse(tagListRequest.response);
                if(jsonResponse.length > 0) {
                    tagList = jsonResponse.objects;
                }
                that.setState({tagList})
            }
            tagListRequest.onerror = function() {
                console.log('get boxList error.');
                that.setState({tagList: []});
            }
        } catch(error) {
            console.log(error);
        }
    }

    saveTagList = (index) => {
        if(this.state.shouldPostTagList) {
            if(this.state.tagList.length > 0) {
                this.setState((state) => {
                    state.shouldPostTagList = false;
                    state.imageList[index].labeled = 1;
                })
                const that = this;
                const saveTagListRequest = new XMLHttpRequest();
                saveTagListRequest.open('POST', `${that.state.defaultURL}savelabel?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${this.state.imageList[index].name}`);
                const result = `{
                    "length": ${this.state.tagList.length},
                    "objects": [
                        ${this.state.tagList.map((tag) => (
                            `{
                                "x_start": ${tag.x_start},
                                "y_start": ${tag.y_start},
                                "x_end": ${tag.x_end},
                                "y_end": ${tag.y_end},
                                "tag": ${JSON.stringify(tag.tag)},
                                "info": "${tag.info ? tag.info : ''}"
                            }`
                        ))}
                    ]
                }`
                saveTagListRequest.send(result);
                saveTagListRequest.onload = function() {
                    console.log('post taglist success.');
                    that.refs.tagRoute.refs.selectedImage.getTagedFileCount();
                }
                saveTagListRequest.onerror = function() {
                    console.log('post taglist error.');
                }
            }
        }
    }

    saveObjectTagList = (index) => {
        if(this.state.shouldPostObjectTagList || this.state.tagList.length === 0){
            this.setState((state) => {
                state.shouldPostObjectTagList = false;
                state.imageList[index].labeled = 1;
            })
            const that = this;
            const request = new XMLHttpRequest();
            request.open('POST', `${that.state.defaultURL}savelabel?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${this.state.imageList[index].name}`);
            const result = JSON.stringify({
                length: 1,
                objects: [
                    {
                        x_start: 0.0,
                        y_start: 0.0,
                        x_end: 1.0,
                        y_end: 1.0,
                        tag: this.state.tagList[0] ? this.state.tagList[0].tag : [document.getElementById('mySelect').value],
                        info: this.state.tagList[0]? this.state.tagList[0].info : ''
                    }
                ]
            });
            request.send(result);
            request.onload = function() {
                that.refs.tagObjectRoute.refs.selectedObjectImage.getTagedFileCount();
            }
        }
    }

    // saveResult = () => {
    //     // let result = `{length: ${this.state.tagList.length} }`
    //     // this.state.tagList.map((tag) => {
    //     //     const x_start = tag.x_start
    //     //     const y_start = tag.y_start
    //     //     const x_end = tag.x_end
    //     //     const y_end = tag.y_end
    //     //     const tag = tag.tag
    //     //     result = result.concat(`${x_start} `).concat(`${y_start} `).concat(`${x_end} `).concat(`${y_end} `).concat(tag).concat('\n')
    //     // })
    //     const result = `{
    //         "length": ${this.state.tagList.length},
    //         "objects": [
    //             ${this.state.tagList.map((tag) => (
    //                 `{
    //                     "x_start": ${tag.x_start},
    //                     "y_start": ${tag.y_start},
    //                     "x_end": ${tag.x_end},
    //                     "y_end": ${tag.y_end},
    //                     "tag": "${tag.tag}"
    //                 }`
    //             ))}
    //         ]
    //     }`
    //
    //     //var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
    //     //saveAs(blob, `${this.state.imageList[this.state.selectedImageNum].name}.txt`);
    //     $.ajax({
    //         url: 'http://192.168.0.118:8888/api/v1.0',
    //         type: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         data: result,
    //         dataType: 'text/plain',
    //         success: function(data) {
    //             console.log(data)
    //         },
    //         error: function(data) {
    //             console.log(data)
    //         }
    //     })
    // }

    addTag = (tag) => {
        this.setState((state) => {
            state.shouldPostTagList = true;
            state.tagList = state.tagList.concat([tag]);
        })
    }

    addObjectTag = (tag) => {
        this.setState((state) => {
            state.shouldPostObjectTagList = true;
            state.tagList = [tag];
        })
    }

    deleteBox = (index) => {
        const that = this;
        this.setState((state) => {
            state.shouldPostTagList = true;
            state.tagList.splice(index, 1);
        }, function() {
            //if delete the last box, tagList will be empty, and don't post the save request.
            if(that.state.tagList.length === 0) {
                const deleteLabel = new XMLHttpRequest();
                deleteLabel.open('GET', `${that.state.defaultURL}dellabel?usrname=${this.state.userName}&taskname=${this.state.taskName}&filename=${that.state.imageList[that.state.selectedImageNum].name}`);
                deleteLabel.send();
                deleteLabel.onload = function() {
                    console.log('delete last box success');
                }
                //delete last box, change the imageList's labeled state.
                that.setState((state) => {
                    state.imageList[that.state.selectedImageNum].labeled = 0;
                })
            }
        })
    }

    changeBoxInfo = (index, value) => {
        this.setState((state) => {
            state.shouldPostTagList = true;
            state.shouldPostObjectTagList = true;
            state.tagList[index].info = value;
        })
    }

    changeTagString = () => {
        this.setState({currentTagString: $('#mySelect').val()});
    }

    changeObjectTagString = () => {
        this.setState({currentTagString: document.getElementById('mySelect').value});
        document.getElementById('mySelect').blur();
    }

    handleNumChange = (e) => {
        const value = e.target.value;
        this.setState((state) => {
            if(value.trim() === '' || parseInt(value, 10) <= 0) {
                state.num = 1;
            } else if(parseInt(value, 10) > 20) {
                state.num = 20;
            } else {
                state.num = parseInt(value, 10);
            }
        });
    }

    handleStartChange = (e) => {
        const value = e.target.value;
        const that = this;
        let maxValue = 0;
        if(that.refs.tagRoute.refs.selectedImage) {
            maxValue = that.refs.tagRoute.refs.selectedImage.state.fileCount;
        } else if(that.refs.tagObjectRoute.refs.selectedObjectImage) {
            maxValue = that.refs.tagObjectRoute.refs.selectedObjectImage.state.fileCount;
        }
        this.setState((state) => {
            if(value.trim() === '' || parseInt(value, 10) <= 0) {
                state.start = 1;
            } else if(parseInt(value, 10) > maxValue) {
                state.start = maxValue;
            } else {
                state.start = parseInt(value, 10);
            }
        });
    }

    changeUserAndTask = (userName, taskName) => {
        const that = this;
        this.props.dispatch(changeTaskName(taskName));
        this.setState({userName: userName, taskName: taskName}, function() {
            that.getImageList();
        });
    }

    showNewImage = (url, name) => {
        this.setState(this.concatNewImage(url, name));
    }

    login = (userName, userLevel, userGroup, password) => {
        this.props.dispatch(changeUserName(userName));
        this.props.dispatch(changeUserLevel(userLevel));
        this.props.dispatch(changePassword(password));
        this.setState({login: true, userName, userLevel, userGroup, password});
    }

    logout = (username) => {
        this.setState({login: false, userName: ''});
    }

    initStartAndNum = () => {
        this.setState({start: 1, num: 10})
    }

    editTagString = (oldTagString, newTagString) => {
        try {
            const request = new XMLHttpRequest();
            request.open('POST', `${this.state.defaultURL}changetag?usrname=${this.state.userName}&taskname=${this.state.taskName}`);
            const data = JSON.stringify({
                oldtag: oldTagString,
                newtag: newTagString
            })
            request.send(data);
            request.onload = () => {
                console.log('edit tagstring success');
            }
        } catch(error) {
            console.log(error);
        }
    }

    addNewTagToBox = (index) => {
        const newTag = document.getElementById('mySelect').value;
        if(this.state.tagList[index].tag.indexOf(newTag) < 0) {
            const listName = document.getElementById('mySelectForListName').value;
            let flag = true;
            this.state.tagList[index].tag.map((tag, index2) => {
                if(this.refs.tagRoute.refs.tagView.state.tagStringListAll[listName].indexOf(tag) >= 0) {
                    this.setState((state) => {
                        state.tagList[index].tag[index2] = newTag;
                        state.shouldPostTagList = true;
                    })
                    flag = false;
                }
            })
            if(flag) {
                this.setState((state) => {
                    state.tagList[index].tag = state.tagList[index].tag.concat([newTag]);
                    state.shouldPostTagList = true;
                });
            }
        }
    }

    addNewTagToBoxForObject = (index) => {
        const newTag = document.getElementById('mySelect').value;
        if(this.state.tagList[index].tag.indexOf(newTag) < 0) {
            const listName = document.getElementById('mySelectForListName').value;
            let flag = true;
            this.state.tagList[index].tag.map((tag, index2) => {
                if(this.refs.tagObjectRoute.refs.tagObjectView.state.tagStringListAll[listName].indexOf(tag) >= 0) {
                    this.setState((state) => {
                        state.tagList[index].tag[index2] = newTag;
                        state.shouldPostObjectTagList = true;
                    })
                    flag = false;
                }
            })
            if(flag) {
                this.setState((state) => {
                    state.tagList[index].tag = state.tagList[index].tag.concat([newTag]);
                    state.shouldPostObjectTagList = true;
                });
            }
        }
    }

    removeTagFromBox = (index, index2) => {
        this.setState((state) => {
            state.tagList[index].tag.splice(index2, 1);
            state.shouldPostTagList = true;
            state.shouldPostObjectTagList = true;
        });
    }

    changeBrowserMode = (mode) => {
        this.setState({currentBrowserMode: mode}, () => {
            if(this.state.currentBrowserMode === 'normal') {
                this.setState({start: 1, num: 10}, () => {this.getImageList()})
            } else if(this.state.currentBrowserMode === 'find') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag()})
            }
        });
    }

    autoTagImages = (start, num) => {
      this.props.dispatch(autoTagImages(start, num));
    }

    render() {
        return (
            <div className="App full-height">
                <Route exact path="/" render={() => (
                    this.state.login ?
                    <TaskPage onInitStartAndNum={this.initStartAndNum}
                              onLogout={this.logout}
                              defaultURL={this.state.defaultURL}
                              username={this.state.userName}
                              userGroup={this.state.userGroup}
                              password={this.state.password}
                              onChangeUserAndTask={this.changeUserAndTask}/>
                    : <Login onLogin={this.login} defaultURL={this.state.defaultURL}/>
                )}/>
                <Route ref="tagRoute" exact path="/tag" render={() => (
                    this.state.login ?
                    <div className="flex-box full-height">
                        <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                            <SelectedImage ref="selectedImage"
                                           onNextImage={this.nextImage}
                                           onPreviousImage={this.previousImage}
                                           num={this.state.num}
                                           info={this.state.info}
                                           currentTagString={this.state.currentTagString}
                                           onAddTag={this.addTag}
                                           selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                                           selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                                           selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                                           complete={this.state.complete}
                                           onDeleteImage={this.deleteImage}
                                           onUploadImgeFiles={this.uploadImageFiles}
                                           onShowNewImage={this.showNewImage}
                                           boxList={this.state.tagList}
                                           defaultURL={this.state.defaultURL}
                                           userName={this.state.userName}
                                           userLevel={this.state.userLevel}
                                           taskName={this.state.taskName}/>
                            <SelectBar onClickItem={this.clickItem}
                                       selectedImageNum={this.state.selectedImageNum}
                                       imageList={this.state.imageList}/>
                        </div>
                        <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                            <TagView ref="tagView"
                               onHandleNumChange={this.handleNumChange}
                               getImageListByTag={this.getImageListByTag}
                               editTagString={this.editTagString}
                               addNewTagToBox={this.addNewTagToBox}
                               removeTagFromBox={this.removeTagFromBox}
                               onHandleStartChange={this.handleStartChange}
                               start={this.state.start}
                               num={this.state.num}
                               info={this.state.info}
                               currentTagString={this.state.currentTagString}
                               onChangeTagString={this.changeTagString}
                               onChangeBrowserMode={this.changeBrowserMode}
                               onGetImageList={this.getImageList}
                               onNextImageList={this.nextImageList}
                               onPreviousImageList={this.previousImageList}
                               boxList={this.state.tagList}
                               onDeleteBox={this.deleteBox}
                               onChangeBoxInfo={this.changeBoxInfo}
                               defaultURL={this.state.defaultURL}
                               userName={this.state.userName}
                               userLevel={this.state.userLevel}
                               taskName={this.state.taskName}
                               onAutoTagImages={this.autoTagImages} />
                        </div>
                    </div> : null
                )}/>
                <Route ref="tagObjectRoute" exact path="/tagobject" render={() => (
                    this.state.login ?
                    <div className="flex-box full-height">
                        <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                            <SelectedObjectImage ref="selectedObjectImage"
                                           onNextImage={this.nextImageForObject}
                                           onPreviousImage={this.previousImageForObject}
                                           num={this.state.num}
                                           info={this.state.info}
                                           currentTagString={this.state.currentTagString}
                                           onAddTag={this.addTag}
                                           selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                                           selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                                           selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                                           complete={this.state.complete}
                                           onDeleteImage={this.deleteImage}
                                           onUploadImgeFiles={this.uploadImageFiles}
                                           onShowNewImage={this.showNewImage}
                                           boxList={this.state.tagList}
                                           defaultURL={this.state.defaultURL}
                                           userName={this.state.userName}
                                           userLevel={this.state.userLevel}
                                           taskName={this.state.taskName}/>
                            <SelectBar onClickItem={this.clickObjectItem} selectedImageNum={this.state.selectedImageNum} imageList={this.state.imageList}/>
                        </div>
                        <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                            <TagObjectView ref="tagObjectView" onHandleNumChange={this.handleNumChange}
                                     getImageListByTag={this.getImageListByTag}
                                     editTagString={this.editTagString}
                                     addNewTagToBox={this.addNewTagToBoxForObject}
                                     removeTagFromBox={this.removeTagFromBox}
                                     onHandleStartChange={this.handleStartChange}
                                     start={this.state.start}
                                     num={this.state.num}
                                     info={this.state.info}
                                     currentTagString={this.state.currentTagString}
                                     onChangeTagString={this.changeObjectTagString}
                                     onChangeBrowserMode={this.changeBrowserMode}
                                     onGetImageList={this.getImageList}
                                     onNextImageList={this.nextImageListForObject}
                                     onPreviousImageList={this.previousImageListForObject}
                                     boxList={this.state.tagList}
                                     onDeleteBox={this.deleteBox}
                                     onChangeBoxInfo={this.changeBoxInfo}
                                     defaultURL={this.state.defaultURL}
                                     userName={this.state.userName}
                                     userLevel={this.state.userLevel}
                                     taskName={this.state.taskName}
                                     onAutoTagImages={this.autoTagImages}/>
                        </div>
                    </div> : null
                )}/>
                <Route exact path="/test" render={() => (
                    this.state.login ? <Demo userName={this.state.userName} taskName={this.state.taskName}/> : null
                )} />
                <Route exact path="/segment" render={() => (
                    this.state.login ?
                    <SegmentView/>
                    : null
                )} />
                <Route exact path="/video" render={() => (
                    this.state.login ?
                    <VideoView />
                    : null
                )} />
                <Route path="/helper" render={() => (
                  <Helper />
                )} />
            </div>
        )
  }
}

export default withRouter(connect()(App));
