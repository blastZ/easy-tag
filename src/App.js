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
import Test from './test_page/Test';
import Login from './login_page/Login';
import SegmentView from './segment_page/SegmentView';
import { changeUserName, changeUserLevel, changeTask, changePassword, autoTagImages } from './actions/app_action';
import { connect } from 'react-redux';
import Helper from './helper_page/Helper';
import VideoView from './video_page/VideoView';
import SelectedDaubImage from './daub_page/SelectedDaubImage';
import SelectDaubBar from './daub_page/SelectDaubBar';
import TagDaubView from './daub_page/TagDaubView';
import WaitingPage from './WaitingPage';
import SelectedPointImage from './point_page/SelectedPointImage';
import TagPointView from './point_page/TagPointView';
import SelectPointBar from './point_page/SelectPointBar';
import TestForAll from './testPageForAll/TestForAll';
import { setObjects } from './daub_page/daub_action';
import { DEFAULT_URL } from './utils/global_config';

class App extends Component {
    state = {
        userGroup: '',
        imageList: [
            //{url: 'http://...', name: 'ding1_6.jpg', labeled: 0}
        ],
        tagList: [
            // {x_start: 0, y_start: 0, x_end: 10, y_end: 20, tag: ['car', 'white'], info: '浙F1234567', checked: false} result format
        ],
        selectedImageNum: 0,
        start: 1,
        num: 10,
        complete: 0,
        login: false,
        shouldPostTagList: false,
        shouldPostObjectTagList: false,
        currentBrowserMode: 'normal', //'normal', 'find',
        tagStringList: {},
        eraseMode: false,
        lineWidth: 4,
        saveDaub: false,
        showWaitingPage: false,
        video: 0,
        boxIndex: 0,
    }

    needPostTagList = () => {
      this.setState({
        shouldPostTagList: true
      })
    }

    shouldShowWaitingPage = () => {
      this.setState({
        showWaitingPage: !this.state.showWaitingPage
      })
    }

    shouldSaveDaub = (value) => {
      this.setState({
        saveDaub: value
      })
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
            fileRequest.open('POST', `${DEFAULT_URL}uploadfile?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${file.name}`);
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

    getFindMethod = (mode) => {
      switch (mode) {
        case 'noLabel': return 'getdirwithouttag';
        case 'reviewed': return 'getdirchecked';
        case 'noReviewed': return 'getdirunchecked';
        case 'passed': return 'getdirpassed';
        case 'noPassed': return 'getdirnotpassed';
        default: return 'getdirwithtag';
      }
    }

    getFindMode = (browserMode) => {
      switch (browserMode) {
        case 'findNoLabel': return 'noLabel';
        case 'findReviewed': return 'reviewed';
        case 'findNoReviewed': return 'noReviewed';
        case 'findPassed': return 'passed';
        case 'findNoPassed': return 'noPassed';
      }
    }

    getImageListByTag = (mode='') => {
        this.setState({selectedImageNum: 0, tagList: []});
        const that = this;
        //load imageList from server
        if(mode === '' || mode === 'label') {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`);
          const data = JSON.stringify({
              tag: mode === '' ? this.props.currentTag : ""
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
        } else {
          const newImageList = [];
          fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
            .then((response) => response.json())
            .then((result) => {
              result.map((image) => {
                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
              })
              this.setState({imageList: newImageList}, () => {
                  this.getTagList(0)
              });
            })
        }
    }

    getImageList = (cb=null) => {
        this.setState({selectedImageNum: 0, tagList: []});
        fetch(`${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}&video=${this.state.video}`)
          .then((response) => response.json())
          .then((result) => {
            const newImageList = [];
            result.map((image) => {
              newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
            })
            this.setState({
              imageList: newImageList
            }, () => {
              this.getTagList(0)
            })
            if(cb) {
              cb();
            }
          })
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
            console.log("nextimagelist: "+`${DEFAULT_URL}`);
            
            xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}&video=${this.state.video}`);
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
                    if(that.refs.tagRoute.refs.selectedImage) that.refs.tagRoute.refs.selectedImage.initSelectedImage();
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
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.props.currentTag
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
        } else if(this.state.currentBrowserMode === 'findLabel') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: ""
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
        } else {
          const mode = this.getFindMode(this.state.currentBrowserMode);
          const newImageList = [];
          fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`)
            .then((response) => response.json())
            .then((result) => {
              result.map((image) => {
                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
              })
              this.setState((state) => {
                  state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                  state.selectedImageNum = 0;
                  state.tagList = [];
                  state.imageList = newImageList;
              }, function() {
                  that.refs.tagRoute.refs.selectedImage.initSelectedImage();
              })
              that.getTagList(0);
            })
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
            xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}&video=${this.state.video}`);
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
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.props.currentTag
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
        } else if(this.state.currentBrowserMode === 'findLabel') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: ""
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
        } else {
            const mode = this.getFindMode(this.state.currentBrowserMode);
            const newImageList = [];
            fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
              .then((response) => response.json())
              .then((result) => {
                result.map((image) => {
                  newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                })
                that.setState((state) => {
                    state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                })
                that.getTagList(0);
              })
        }
    }

    nextImageListForDaub = () => {
      this.saveDaubData(this.state.selectedImageNum);
      const that = this;
      let maxValue = 0;
      if(that.refs.tagDaubRoute && that.refs.tagDaubRoute.refs.selectedDaubImage) {
          maxValue = that.refs.tagDaubRoute.refs.selectedDaubImage.state.fileCount;
      }
      if(this.state.currentBrowserMode === 'normal') {
        fetch(`${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num > maxValue ? maxValue : this.state.start + this.state.num}&num=${this.state.num}&video=${this.state.video}`)
          .then((response) => (response.json()))
          .then((result) => {
            const newImageList = [];
            result.map((image) => {
                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
            })
            this.setState((state) => {
                state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                state.selectedImageNum = 0;
                state.imageList = newImageList;
            }, function() {
                if(that.refs.tagDaubRoute.refs.selectedDaubImage) that.refs.tagDaubRoute.refs.selectedDaubImage.getWrappedInstance().initSelectedImage();
            })
            setTimeout(() => {
              this.getDaubData(0);
            }, 300)
          })
      } else if(this.state.currentBrowserMode === 'find') {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
          const data = JSON.stringify({
              tag: this.props.currentTag
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
                  that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
              })
              setTimeout(() => {
                that.getDaubData(0);
              }, 300)
          }
      } else if(this.state.currentBrowserMode === 'findLabel') {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start + this.state.num}&num=${this.state.num}`);
          const data = JSON.stringify({
              tag: ""
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
                  that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
              })
              setTimeout(() => {
                that.getDaubData(0);
              }, 300)
          }
      } else {
          const mode = this.getFindMode(this.state.currentBrowserMode);
          const newImageList = [];
          fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
            .then((response) => response.json())
            .then((result) => {
              result.map((image) => {
                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
              })
              that.setState((state) => {
                  state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
                  state.selectedImageNum = 0;
                  state.tagList = [];
                  state.imageList = newImageList;
              }, function() {
                  that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
              })
              setTimeout(() => {
                that.getDaubData(0);
              }, 300)
            })
      }
    }

    previousImageList = () => {
        const that = this;
        this.saveTagList(this.state.selectedImageNum);
        if(this.state.currentBrowserMode === 'normal') {
            //load imageList from server
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}&video=${this.state.video}`);
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
                    if(that.refs.tagRoute.refs.selectedImage) that.refs.tagRoute.refs.selectedImage.initSelectedImage();
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
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.props.currentTag
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
        } else if(this.state.currentBrowserMode === 'findLabel') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: ""
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
        } else {
            const mode = this.getFindMode(this.state.currentBrowserMode);
            const newImageList = [];
            fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`)
              .then((response) => response.json())
              .then((result) => {
                result.map((image) => {
                  newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                })
                that.setState((state) => {
                    state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                })
                that.getTagList(0);
              })
        }
    }

    previousImageListForObject = () => {
        const that = this;
        this.saveObjectTagList(this.state.selectedImageNum);
        if(this.state.currentBrowserMode === 'normal') {
            //load imageList from server
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}&video=${this.state.video}`);
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
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: this.props.currentTag
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
        } else if(this.state.currentBrowserMode === 'findLabel') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
            const data = JSON.stringify({
                tag: ""
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
        } else {
            const mode = this.getFindMode(this.state.currentBrowserMode);
            const newImageList = [];
            fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
              .then((response) => response.json())
              .then((result) => {
                result.map((image) => {
                  newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                })
                that.setState((state) => {
                    state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                    state.selectedImageNum = 0;
                    state.tagList = [];
                    state.imageList = newImageList;
                }, function() {
                    that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                })
                that.getTagList(0);
              })
        }
    }

    previousImageListForDaub = () => {
      const that = this;
      this.saveDaubData(this.state.selectedImageNum);
      if(this.state.currentBrowserMode === 'normal') {
          //load imageList from server
          fetch(`${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`)
            .then((response) => response.json())
            .then((result) => {
              const newImageList = [];
              result.map((image) => {
                  newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
              })
              this.setState((state) => {
                  state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                  state.selectedImageNum = 0;
                  state.imageList = newImageList;
              }, function() {
                  if(that.refs.tagDaubRoute.refs.selectedDaubImage) that.refs.tagDaubRoute.refs.selectedDaubImage.getWrappedInstance().initSelectedImage();
              })
            })
            setTimeout(() => {
              this.getDaubData(0);
            }, 300)
      } else if(this.state.currentBrowserMode === 'find') {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
          const data = JSON.stringify({
              tag: this.props.currentTag
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
                  that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
              })
              setTimeout(() => {
                that.getDaubData(0);
              }, 300)
          }
      } else if(this.state.currentBrowserMode === 'findLabel') {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
          const data = JSON.stringify({
              tag: ""
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
                  that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
              })
              setTimeout(() => {
                that.getDaubData(0);
              }, 300)
          }
      } else {
          const mode = this.getFindMode(this.state.currentBrowserMode);
          const newImageList = [];
          fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
            .then((response) => response.json())
            .then((result) => {
              result.map((image) => {
                newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
              })
              that.setState((state) => {
                  state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                  state.selectedImageNum = 0;
                  state.tagList = [];
                  state.imageList = newImageList;
              }, function() {
                  that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
              })
              setTimeout(() => {
                that.getDaubData(0);
              }, 300)
            })
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
                    xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}&video=${this.state.video}`);
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
                    xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const data = JSON.stringify({
                        tag: this.props.currentTag
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
            } else if(this.state.currentBrowserMode === 'findLabel') {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const data = JSON.stringify({
                        tag: ""
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
            } else {
                try {
                    const mode = this.getFindMode(this.state.currentBrowserMode);
                    const newImageList = [];
                    fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
                      .then((response) => response.json())
                      .then((result) => {
                        result.map((image) => {
                          newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                        })
                        that.setState((state) => {
                            state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                            state.selectedImageNum = newImageList.length - 1;
                            state.tagList = [];
                            state.imageList = newImageList;
                        }, function() {
                            that.refs.tagRoute.refs.selectedImage.initSelectedImage();
                        })
                        that.getTagList(newImageList.length - 1);
                      })
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
                    xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}&video=${this.state.video}`);
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
                    xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const data = JSON.stringify({
                        tag: this.props.currentTag
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
            } else if(this.state.currentBrowserMode === 'findLabel') {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                    const data = JSON.stringify({
                        tag: ""
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
            } else {
                try {
                    const mode = this.getFindMode(this.state.currentBrowserMode);
                    const newImageList = [];
                    fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
                      .then((response) => response.json())
                      .then((result) => {
                        result.map((image) => {
                          newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                        })
                        that.setState((state) => {
                            state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                            state.selectedImageNum = newImageList.length - 1;
                            state.tagList = [];
                            state.imageList = newImageList;
                        }, function() {
                            that.refs.tagObjectRoute.refs.selectedObjectImage.initSelectedImage();
                        })
                        that.getTagList(newImageList.length - 1);
                      })
                } catch(error) {
                    console.log(error);
                }
            }
        }
    }

    previousImageListForShortcutForDaub = () => {
      this.saveDaubData(this.state.selectedImageNum);
      const that = this;
      //load imageList from server
      if(this.state.start === 1 && this.state.selectedImageNum === 0) {

      } else {
          if(this.state.currentBrowserMode === 'normal') {
              try {
                  const xhr = new XMLHttpRequest();
                  xhr.open('GET', `${DEFAULT_URL}getdir?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}&video=${this.state.video}`);
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
                          that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
                      })
                      that.getDaubData(newImageList.length - 1);
                  }
                  xhr.onerror = function() {
                      console.log('getNextList failed');
                      that.getDaubData(newImageList.length - 1);
                  }
                  xhr.send();
              } catch(error) {
                  console.log(error);
              }
          } else if(this.state.currentBrowserMode === 'find') {
              try {
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                  const data = JSON.stringify({
                      tag: this.props.currentTag
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
                          that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
                      })
                      that.getDaubData(newImageList.length - 1);
                  }
              } catch(error) {
                  console.log(error);
              }
          } else if(this.state.currentBrowserMode === 'findLabel') {
              try {
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', `${DEFAULT_URL}getdirwithtag?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${(this.state.start - this.state.num) > 0 ? (this.state.start - this.state.num) : 1}&num=${this.state.num}`);
                  const data = JSON.stringify({
                      tag: ""
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
                          that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
                      })
                      that.getDaubData(newImageList.length - 1);
                  }
              } catch(error) {
                  console.log(error);
              }
          } else {
              try {
                  const mode = this.getFindMode(this.state.currentBrowserMode);
                  const newImageList = [];
                  fetch(`${DEFAULT_URL}${this.getFindMethod(mode)}?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${this.state.start}&num=${this.state.num}`)
                    .then((response) => response.json())
                    .then((result) => {
                      result.map((image) => {
                        newImageList.push({url: image.url, name: image.name, labeled: image.labeled});
                      })
                      that.setState((state) => {
                          state.start = state.start - state.num > 0 ? state.start - state.num : 1;
                          state.selectedImageNum = newImageList.length - 1;
                          state.tagList = [];
                          state.imageList = newImageList;
                      }, function() {
                          that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
                      })
                      that.getDaubData(newImageList.length - 1);
                    })
              } catch(error) {
                  console.log(error);
              }
          }
      }
    }

    deleteImage = () => {
        const result = window.confirm("确定删除这张图片吗?");
        if(result) {
            const { imageList, selectedImageNum } = this.state;
            const { defaultURL, userName, taskName } = this.props;
            fetch(`${defaultURL}delfile?usrname=${userName}&taskname=${taskName}&filename=${imageList[selectedImageNum].name}`)
                .then(() => {
                    if(selectedImageNum === 0) {
                        this.setState((preState) => ({
                            imageList: preState.imageList.filter((image, index) => index !== 0),
                            selectedImageNum: 0
                        }))
                    } else {
                        this.setState((preState) => ({
                            imageList: preState.imageList.filter((image, index) => index !== selectedImageNum),
                            selectedImageNum: preState.selectedImageNum - 1
                        }))
                    }
                })
            if(this.refs.tagRoute.refs.selectedImage) {
                this.refs.tagRoute.refs.selectedImage.getFileCount();
                this.refs.tagRoute.refs.selectedImage.getTagedFileCount();
            }
            if(this.refs.tagObjectRoute.refs.selectedObjectImage) {
                this.refs.tagObjectRoute.refs.selectedObjectImage.getFileCount();
                this.refs.tagObjectRoute.refs.selectedObjectImage.getTagedFileCount();
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

    nextImageForDaub = () => {
      const that = this, preIndex = this.state.selectedImageNum;
      if(preIndex + 1 < this.state.imageList.length) {
          this.setState((state) => {
              state.selectedImageNum = preIndex + 1;
              if(this.state.saveDaub) that.saveDaubData(preIndex);
              that.getDaubData(preIndex + 1);
          }, function() {
              that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
          })
      } else if(preIndex + 1 === this.state.imageList.length) {
          this.nextImageListForDaub();
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

    previousImageForDaub = () => {
      const that = this, preIndex = this.state.selectedImageNum;
      if(preIndex - 1 >= 0) {
          this.setState((state) => {
              state.selectedImageNum = preIndex - 1;
              if(this.state.saveDaub) that.saveDaubData(preIndex);
              that.getDaubData(preIndex - 1);
          }, function() {
              that.refs.tagDaubRoute.refs.selectedDaubImage.initSelectedImage();
          })
      } else {
          this.previousImageListForShortcutForDaub();
      }
    }

    clickItem = (url) => {
        this.changeBoxIndex(0);
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

    clickDaubItem = (url) => {
        const preIndex = this.state.selectedImageNum;
        const that = this;
        for(let i=0; i<this.state.imageList.length; i++) {
            if(this.state.imageList[i].url === url) {
                if(preIndex !== i) {
                    if(that.state.saveDaub) {
                      that.saveDaubData(preIndex);
                      that.shouldSaveDaub(false);
                    }
                    that.getDaubData(i);
                }
                if(this.state.imageList.length === 1) {
                    if(that.state.saveDaub) {
                      that.saveDaubData(preIndex);
                      that.shouldSaveDaub(false);
                    }
                }
                this.setState((state) => {
                    state.selectedImageNum = i
                }, function() {
                    that.refs.tagDaubRoute.refs.selectedDaubImage.getWrappedInstance().initSelectedImage();
                    that.refs.tagDaubRoute.refs.tagDaubView.getWrappedInstance().changeAutoTagStart(that.state.selectedImageNum + that.state.start);
                })
                break
            }
        }
    }

    clickPointItem = (url) => {
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
                    that.refs.tagPointRoute.refs.selectedPointImage.initSelectedImage();
                    that.refs.tagPointRoute.refs.tagPointView.changeAutoTagStart(that.state.selectedImageNum + that.state.start);
                })
                break
            }
        }
    }

    saveDaubData = (index) => {
      const canvas = document.getElementById('selectedCanvas');
      const ctx = canvas.getContext('2d');
      const objects = this.props.objects;
      const img = canvas.toDataURL();
      fetch(`${DEFAULT_URL}savelabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`, {
        method: 'POST',
        body: JSON.stringify({
          img,
          objects
        })
      }).then(() => {
        if(this.state.imageList[index]) {
          this.setState((state) => {
            state.imageList[index].labeled = 1;
          })
        }
        this.refs.tagDaubRoute.refs.selectedDaubImage.getWrappedInstance().getTagedFileCount();
      })
    }

    getDaubData = (index) => {
      fetch(`${DEFAULT_URL}loadlabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`)
        .then((response) => response.json())
        .then((result) => {
          if(result.img && result.objects) {
            this.props.dispatch(setObjects(result.objects));
            const canvas = document.getElementById('selectedCanvas');
            const image = document.getElementById('selectedImage');
            const ctx = canvas.getContext('2d');
            const newImage = new Image();
            newImage.onload = () => {
              ctx.clearRect(0, 0, result.width, result.height);
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(newImage, 0, 0, image.width, image.height);
            }
            newImage.src = result.img;
          } else {
            this.props.dispatch(setObjects([]));
          }
        })
    }

    getTagList = (index) => {
        const that = this;
        let tagList = [];
        try {
            const tagListRequest = new XMLHttpRequest();
            tagListRequest.open('GET',
            encodeURI(`${DEFAULT_URL}loadlabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`));
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
                saveTagListRequest.open('POST', `${DEFAULT_URL}savelabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`);
                const result = `{
                    "length": ${this.state.tagList.length},
                    "objects": [
                        ${this.state.tagList.map((tag) => (
                          JSON.stringify(tag)
                        ))}
                    ]
                }`
                saveTagListRequest.send(result);
                saveTagListRequest.onload = function() {
                    console.log('post taglist success.');
                    if(that.refs.tagRoute.refs.selectedImage) that.refs.tagRoute.refs.selectedImage.getTagedFileCount();
                    if(that.refs.tagPointRoute.refs.selectedPointImage) that.refs.tagPointRoute.refs.selectedPointImage.getTagedFileCount();
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
            request.open('POST', `${DEFAULT_URL}savelabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`);
            const result = JSON.stringify({
                length: 1,
                objects: [
                    {
                        x_start: 0.0,
                        y_start: 0.0,
                        x_end: 1.0,
                        y_end: 1.0,
                        tag: this.state.tagList[0] ? this.state.tagList[0].tag : [this.props.currentTag],
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
                deleteLabel.open('GET', `${DEFAULT_URL}dellabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${that.state.imageList[that.state.selectedImageNum].name}`);
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
        } else if(that.refs.tagDaubRoute.refs.selectedDaubImage) {
            maxValue = that.refs.tagDaubRoute.refs.selectedDaubImage.state.fileCount;
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

    changeUserAndTask = (userName, taskName, taskType) => {
        const that = this;
        this.props.dispatch(changeTask({name: taskName, type: taskType}));
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
            request.open('POST', `${DEFAULT_URL}changetag?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
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
        const newTag = this.props.currentTag;
        if(this.state.tagList[index].tag.indexOf(newTag) < 0) {
            const listName = this.props.currentList;
            let flag = true;
            this.state.tagList[index].tag.map((tag, index2) => {
                if(this.props.tagStringListAll[listName].indexOf(tag) >= 0) {
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
        const newTag = this.props.currentTag;
        if(this.state.tagList[index].tag.indexOf(newTag) < 0) {
            const listName = this.props.currentList;
            let flag = true;
            this.state.tagList[index].tag.map((tag, index2) => {
                if(this.props.tagStringListAll[listName].indexOf(tag) >= 0) {
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
        if(this.state.tagList[index].tag.length === 1) {
          window.alert('不能删除最后一个标签');
        } else {
          this.setState((state) => {
              state.tagList[index].tag.splice(index2, 1);
              state.shouldPostTagList = true;
              state.shouldPostObjectTagList = true;
          });
        }
    }

    changeBrowserMode = (mode) => {
        this.setState({currentBrowserMode: mode}, () => {
            if(this.state.currentBrowserMode === 'normal') {
                this.setState({start: 1, num: 10}, () => {this.getImageList()})
            } else if(this.state.currentBrowserMode === 'find') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag()})
            } else if(this.state.currentBrowserMode === 'findLabel') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag('label')})
            } else if(this.state.currentBrowserMode === 'findNoLabel') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag('noLabel')})
            } else if(this.state.currentBrowserMode === 'findReviewed') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag('reviewed')})
            } else if(this.state.currentBrowserMode === 'findNoReviewed') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag('noReviewed')})
            } else if(this.state.currentBrowserMode === 'findPassed') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag('passed')})
            } else if(this.state.currentBrowserMode === 'findNoPassed') {
                this.setState({start: 1, num: 10}, () => {this.getImageListByTag('noPassed')})
            }
        });
    }

    autoTagImages = (start, num, pretrainmodel) => {
      this.props.dispatch(autoTagImages(start, num, pretrainmodel));
    }

    autoDeleteSameFiles = () => {
      fetch(`${DEFAULT_URL}delsamefile?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
        .then((response) => response.text())
        .then((result) => {
          this.getImageList();
        })
    }

    changeLineWidth = (e) => {
      let value = parseInt(e.target.value, 10);
      if(value < 2) {
        value = 2;
      }
      this.setState({
        lineWidth: value
      }, () => {
        this.getCursor((dataURL) => {
          document.getElementById('selectedCanvas').style.cursor = `url(${dataURL}), pointer`;
        })
      })
    }

    getCursor = (setCursor) => {
      const img = new Image();
      img.src = require('./imgs/cursor.png');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.state.lineWidth * 2;
        canvas.height = this.state.lineWidth * 2;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        setCursor(dataURL);
      }
    }

    changeEraseMode = (e) => {
      let value = e.target.checked;
      this.setState({
        eraseMode: value
      })
    }

    bindVideoFileEvent = (interval, e) => {
      if(interval === '') {
        window.alert('时间间隔不能为空');
      } else {
        const file = e.target.files[0];
        if(file) {
          this.shouldShowWaitingPage();
          const name = file.name;
          const type = name.split('.')[1];
          if(type === 'mp4' || type === 'MP4' || type === 'avi' || type === 'AVI' || type === 'MTS' || type === 'mts' || type === 'mov' || type === 'MOV' || type === 'wmv' || type === 'WMV' || type === 'mpg' || type === 'MPG' || type === 'ts' || type === 'TS') {
            const formData = new FormData();
            formData.append('file', file);
            fetch(`${DEFAULT_URL}uploadvideo2image?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${file.name}&interval=${interval}`, {
              method: 'POST',
              body: formData
            }).then((response) => response.text())
              .then((result) => {
                setTimeout(() => {
                  this.getImageList();
                  this.shouldShowWaitingPage();
                }, 6000)
              })
          } else {
            window.alert('视频格式错误');
          }
        }
      }
    }

    changeBoxIndex = (index) => {
      this.setState({
        boxIndex: index
      })
    }

    changeReviewState = (value, index) => {
      let theBox = this.state.tagList[index];
      theBox.checked = value;
      if(value === 'YES') {
        if(theBox.reason) {
          delete theBox.reason
        }
      }
      theBox.reviewer = this.props.userName;
      this.setState({
        tagList: this.state.tagList.map((box, theIndex) => {
          if(theIndex === index) {
            return theBox;
          } else {
            return box;
          }
        }),
        shouldPostTagList: true
      })
    }

    changeReason = (value, index) => {
      let theBox = this.state.tagList[index];
      theBox.reason = value;
      this.setState({
        tagList: this.state.tagList.map((box, theIndex) => {
          if(theIndex === index) {
            return theBox;
          } else {
            return box;
          }
        }),
        shouldPostTagList: true
      })
    }

    setImgList = (list) => {
      this.setState({
        imageList: list,
        tagList: []
      }, () => {
        if(this.state.imageList.length > 0) {
          setTimeout(() => {
            this.clickItem(list[0].url);
            this.getTagList(0);
          }, 300)
        }
      })
    }

    changeBox = (index, x_start, y_start, x_end, y_end) => {
      let newTagList = this.state.tagList;
      newTagList[index].x_start = x_start;
      newTagList[index].y_start = y_start;
      newTagList[index].x_end = x_end;
      newTagList[index].y_end = y_end;
      this.setState({
        tagList: newTagList,
        shouldPostTagList: true
      })
    }

    render() {
        return (
            <div className="App full-height">
                {this.state.showWaitingPage && <WaitingPage text="视频解码中"/>}
                <Route exact path="/" render={() => (
                    this.state.login ?
                    <TaskPage onInitStartAndNum={this.initStartAndNum}
                              onLogout={this.logout}
                              defaultURL={DEFAULT_URL}
                              username={this.props.userName}
                              userGroup={this.state.userGroup}
                              password={this.props.password}
                              onChangeUserAndTask={this.changeUserAndTask}/>
                    : <Login onLogin={this.login} defaultURL={DEFAULT_URL}/>
                )}/>
                <Route ref="tagRoute" exact path="/tag" render={() => (
                    this.state.login ?
                    <div className="flex-box full-height">
                        <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                            <SelectedImage ref="selectedImage"
                               setImgList={this.setImgList}
                               boxIndex={this.state.boxIndex}
                               changeBoxIndex={this.changeBoxIndex}
                               changeBox={this.changeBox}
                               bindVideoFileEvent={this.bindVideoFileEvent}
                               deleteSameImage={this.autoDeleteSameFiles}
                               getImageList={this.getImageList}
                               onNextImage={this.nextImage}
                               onPreviousImage={this.previousImage}
                               num={this.state.num}
                               info={this.state.info}
                               currentTag={this.props.currentTag}
                               onAddTag={this.addTag}
                               selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                               selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                               selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                               complete={this.state.complete}
                               onDeleteImage={this.deleteImage}
                               onUploadImgeFiles={this.uploadImageFiles}
                               onShowNewImage={this.showNewImage}
                               boxList={this.state.tagList}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}/>
                            <SelectBar onClickItem={this.clickItem}
                                       selectedImageNum={this.state.selectedImageNum}
                                       imageList={this.state.imageList}/>
                        </div>
                        <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                            <TagView ref="tagView"
                               imageList={this.state.imageList}
                               clickItem={this.clickItem}
                               getImageList={this.getImageList}
                               changeReviewState={this.changeReviewState}
                               changeReason={this.changeReason}
                               boxIndex={this.state.boxIndex}
                               changeBoxIndex={this.changeBoxIndex}
                               selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                               selectedImageNum={this.state.selectedImageNum}
                               selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                               getBoxList={this.getTagList}
                               needPostTagList={this.needPostTagList}
                               onHandleNumChange={this.handleNumChange}
                               getImageListByTag={this.getImageListByTag}
                               editTagString={this.editTagString}
                               addNewTagToBox={this.addNewTagToBox}
                               removeTagFromBox={this.removeTagFromBox}
                               onHandleStartChange={this.handleStartChange}
                               start={this.state.start}
                               num={this.state.num}
                               info={this.state.info}
                               currentTag={this.props.currentTag}
                               onChangeBrowserMode={this.changeBrowserMode}
                               onGetImageList={this.getImageList}
                               onNextImageList={this.nextImageList}
                               onPreviousImageList={this.previousImageList}
                               boxList={this.state.tagList}
                               onDeleteBox={this.deleteBox}
                               onChangeBoxInfo={this.changeBoxInfo}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}
                               onAutoTagImages={this.autoTagImages} />
                        </div>
                    </div> : null
                )}/>
                <Route ref="tagObjectRoute" exact path="/tagobject" render={() => (
                    this.state.login ?
                    <div className="flex-box full-height">
                        <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                            <SelectedObjectImage ref="selectedObjectImage"
                               setImgList={this.setImgList}
                               bindVideoFileEvent={this.bindVideoFileEvent}
                               deleteSameImage={this.autoDeleteSameFiles}
                               getImageList={this.getImageList}
                               onNextImage={this.nextImageForObject}
                               onPreviousImage={this.previousImageForObject}
                               num={this.state.num}
                               info={this.state.info}
                               currentTag={this.props.currentTag}
                               onAddTag={this.addTag}
                               selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                               selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                               selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                               complete={this.state.complete}
                               onDeleteImage={this.deleteImage}
                               onUploadImgeFiles={this.uploadImageFiles}
                               onShowNewImage={this.showNewImage}
                               boxList={this.state.tagList}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}/>
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
                               currentTag={this.props.currentTag}
                               onChangeBrowserMode={this.changeBrowserMode}
                               onGetImageList={this.getImageList}
                               onNextImageList={this.nextImageListForObject}
                               onPreviousImageList={this.previousImageListForObject}
                               boxList={this.state.tagList}
                               onDeleteBox={this.deleteBox}
                               onChangeBoxInfo={this.changeBoxInfo}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}
                               onAutoTagImages={this.autoTagImages}/>
                        </div>
                    </div> : null
                )}/>
                <Route exact path="/test" render={() => (
                    <Test
                        boxIndex={this.state.boxIndex}
                        bindVideoFileEvent={this.bindVideoFileEvent}
                        deleteSameImage={this.autoDeleteSameFiles}
                        getImageList={this.getImageList}
                        onNextImage={this.nextImage}
                        onPreviousImage={this.previousImage}
                        num={this.state.num}
                        info={this.state.info}
                        currentTag={this.props.currentTag}
                        onAddTag={this.addTag}
                        selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                        selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                        selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                        complete={this.state.complete}
                        onDeleteImage={this.deleteImage}
                        onUploadImgeFiles={this.uploadImageFiles}
                        onShowNewImage={this.showNewImage}
                        boxList={this.state.tagList}
                        userName={this.props.userName}
                        userLevel={this.props.userLevel}
                        taskName={this.props.taskName}
                        onClickItem={this.clickItem}
                        selectedImageNum={this.state.selectedImageNum}
                        imageList={this.state.imageList}
                        boxIndex={this.state.boxIndex}
                        changeBoxIndex={this.changeBoxIndex}
                        selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                        selectedImageNum={this.state.selectedImageNum}
                        getBoxList={this.getTagList}
                        needPostTagList={this.needPostTagList}
                        onHandleNumChange={this.handleNumChange}
                        getImageListByTag={this.getImageListByTag}
                        editTagString={this.editTagString}
                        addNewTagToBox={this.addNewTagToBox}
                        removeTagFromBox={this.removeTagFromBox}
                        onHandleStartChange={this.handleStartChange}
                        start={this.state.start}
                        num={this.state.num}
                        info={this.state.info}
                        currentTag={this.props.currentTag}
                        onChangeBrowserMode={this.changeBrowserMode}
                        onGetImageList={this.getImageList}
                        onNextImageList={this.nextImageList}
                        onPreviousImageList={this.previousImageList}
                        boxList={this.state.tagList}
                        onDeleteBox={this.deleteBox}
                        onChangeBoxInfo={this.changeBoxInfo}
                        defaultURL={DEFAULT_URL}
                        onAutoTagImages={this.autoTagImages} />
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
                <Route ref="tagDaubRoute" exact path="/daub" render={() => (
                  this.state.login ?
                    <div className="flex-box full-height">
                        <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                            <SelectedDaubImage ref="selectedDaubImage"
                               bindVideoFileEvent={this.bindVideoFileEvent}
                               getCursor={this.getCursor}
                               shouldSaveDaub={this.shouldSaveDaub}
                               eraseMode={this.state.eraseMode}
                               lineWidth={this.state.lineWidth}
                               imageList={this.state.imageList}
                               getDaubData={this.getDaubData}
                               deleteSameImage={this.autoDeleteSameFiles}
                               getImageList={this.getImageList}
                               onNextImage={this.nextImageForDaub}
                               onPreviousImage={this.previousImageForDaub}
                               num={this.state.num}
                               info={this.state.info}
                               currentTag={this.props.currentTag}
                               onAddTag={this.addTag}
                               selectedImageNum={this.state.selectedImageNum}
                               selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                               selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                               selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                               complete={this.state.complete}
                               onDeleteImage={this.deleteImage}
                               onUploadImgeFiles={this.uploadImageFiles}
                               onShowNewImage={this.showNewImage}
                               boxList={this.state.tagList}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}/>
                            <SelectDaubBar onClickItem={this.clickDaubItem}
                                       selectedImageNum={this.state.selectedImageNum}
                                       imageList={this.state.imageList}/>
                        </div>
                        <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                            <TagDaubView ref="tagDaubView"
                               shouldSaveDaub={this.shouldSaveDaub}
                               eraseMode={this.state.eraseMode}
                               changeEraseMode={this.changeEraseMode}
                               lineWidth={this.state.lineWidth}
                               changeLineWidth={this.changeLineWidth}
                               setColorList={this.setColorList}
                               onHandleNumChange={this.handleNumChange}
                               getImageListByTag={this.getImageListByTag}
                               editTagString={this.editTagString}
                               addNewTagToBox={this.addNewTagToBox}
                               removeTagFromBox={this.removeTagFromBox}
                               onHandleStartChange={this.handleStartChange}
                               start={this.state.start}
                               num={this.state.num}
                               info={this.state.info}
                               currentTag={this.props.currentTag}
                               onChangeBrowserMode={this.changeBrowserMode}
                               onGetImageList={this.getImageList}
                               onNextImageList={this.nextImageListForDaub}
                               onPreviousImageList={this.previousImageListForDaub}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}
                               onAutoTagImages={this.autoTagImages} />
                        </div>
                    </div>
                    : null
                )}/>
                <Route ref="tagPointRoute" exact path="/point" render={() => (
                    this.state.login ?
                    <div className="flex-box full-height">
                        <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                            <SelectedPointImage ref="selectedPointImage"
                               bindVideoFileEvent={this.bindVideoFileEvent}
                               deleteSameImage={this.autoDeleteSameFiles}
                               getImageList={this.getImageList}
                               onNextImage={this.nextImage}
                               onPreviousImage={this.previousImage}
                               num={this.state.num}
                               info={this.state.info}
                               currentTag={this.props.currentTag}
                               onAddTag={this.addTag}
                               selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                               selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                               selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                               complete={this.state.complete}
                               onDeleteImage={this.deleteImage}
                               onUploadImgeFiles={this.uploadImageFiles}
                               onShowNewImage={this.showNewImage}
                               boxList={this.state.tagList}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}/>
                            <SelectPointBar onClickItem={this.clickPointItem}
                                       selectedImageNum={this.state.selectedImageNum}
                                       imageList={this.state.imageList}/>
                        </div>
                        <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                            <TagPointView ref="tagPointView"
                               selectedImageNum={this.state.selectedImageNum}
                               getBoxList={this.getTagList}
                               needPostTagList={this.needPostTagList}
                               onHandleNumChange={this.handleNumChange}
                               getImageListByTag={this.getImageListByTag}
                               editTagString={this.editTagString}
                               addNewTagToBox={this.addNewTagToBox}
                               removeTagFromBox={this.removeTagFromBox}
                               onHandleStartChange={this.handleStartChange}
                               start={this.state.start}
                               num={this.state.num}
                               info={this.state.info}
                               onChangeBrowserMode={this.changeBrowserMode}
                               onGetImageList={this.getImageList}
                               onNextImageList={this.nextImageList}
                               onPreviousImageList={this.previousImageList}
                               boxList={this.state.tagList}
                               onDeleteBox={this.deleteBox}
                               onChangeBoxInfo={this.changeBoxInfo}
                               defaultURL={DEFAULT_URL}
                               userName={this.props.userName}
                               userLevel={this.props.userLevel}
                               taskName={this.props.taskName}
                               onAutoTagImages={this.autoTagImages} />
                        </div>
                    </div> : null
                )}/>
                <Route exact path="/testforall" render={() => (
                  <TestForAll
                    boxIndex={this.state.boxIndex}
                    bindVideoFileEvent={this.bindVideoFileEvent}
                    deleteSameImage={this.autoDeleteSameFiles}
                    getImageList={this.getImageList}
                    onNextImage={this.nextImage}
                    onPreviousImage={this.previousImage}
                    num={this.state.num}
                    info={this.state.info}
                    currentTag={this.props.currentTag}
                    onAddTag={this.addTag}
                    selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                    selectedImageName={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : 'No Image'}
                    selectedImageNumInAll={parseInt(this.state.start) + this.state.selectedImageNum}
                    complete={this.state.complete}
                    onDeleteImage={this.deleteImage}
                    onUploadImgeFiles={this.uploadImageFiles}
                    onShowNewImage={this.showNewImage}
                    boxList={this.state.tagList}
                    userName={this.props.userName}
                    userLevel={this.props.userLevel}
                    taskName={this.props.taskName}
                    onClickItem={this.clickItem}
                    selectedImageNum={this.state.selectedImageNum}
                    imageList={this.state.imageList}
                    boxIndex={this.state.boxIndex}
                    changeBoxIndex={this.changeBoxIndex}
                    selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                    selectedImageNum={this.state.selectedImageNum}
                    getBoxList={this.getTagList}
                    needPostTagList={this.needPostTagList}
                    onHandleNumChange={this.handleNumChange}
                    getImageListByTag={this.getImageListByTag}
                    editTagString={this.editTagString}
                    addNewTagToBox={this.addNewTagToBox}
                    removeTagFromBox={this.removeTagFromBox}
                    onHandleStartChange={this.handleStartChange}
                    start={this.state.start}
                    num={this.state.num}
                    info={this.state.info}
                    currentTag={this.props.currentTag}
                    onChangeBrowserMode={this.changeBrowserMode}
                    onGetImageList={this.getImageList}
                    onNextImageList={this.nextImageList}
                    onPreviousImageList={this.previousImageList}
                    boxList={this.state.tagList}
                    onDeleteBox={this.deleteBox}
                    onChangeBoxInfo={this.changeBoxInfo}
                    defaultURL={DEFAULT_URL}
                    onAutoTagImages={this.autoTagImages} />
                )} />
            </div>
        )
  }
}

const mapStateToProps = ({ appReducer, daubReducer }) => ({
  defaultURL: appReducer.defaultURL,
  userName: appReducer.userName,
  taskName: appReducer.taskName,
  userLevel: appReducer.userLevel,
  password: appReducer.password,
  showImageMode: appReducer.showImageMode,
  objects: daubReducer.objects,
  currentTag: appReducer.tagSelector.currentTag,
  currentList: appReducer.tagSelector.currentList,
  tagStringListAll: appReducer.tagSelector.tagStringListAll
})

export default withRouter(connect(mapStateToProps)(App));
