import React, {Component} from 'react'
import NavBar from './NavBar.js'
import SelectedImage from './SelectedImage.js'
import SelectBar from './SelectBar.js'
import $ from 'jquery'

class ImageView extends Component {
    state = {
        imageList: [
            //{url: '', resultData: {}, resultDataOfFace: {}}
        ],
        selectedImage: 0,
    }

    //click navbar item to show image and send request
    clickItem = (strURL) => {
        this.props.onClickItem()
        const that = this
        const imageList = this.state.imageList;
        for(let i=0; i<imageList.length; i++) {
            if(imageList[i].url.toString() === strURL) {
                this.setState({selectedImage: i});
                this.sendRequestInMode(this.props.mode, null, i, strURL, 'no-new');
                break;
            }
        }
    }

    sendRequestInMode(mode, file, index, strURL, isNew) {
        const imageList = this.state.imageList
        const i = index
        const that = this
        if(mode === 'GENERAL') {
            if(isNew === 'new') {
                this.sendFileRequest(file, strURL, 0, 'new')
            } else {
                if(JSON.stringify(imageList[i].resultData) === '{}') {
                    this.sendFileRequest(file, strURL, i, isNew)
                } else {
                    //wait the canvas initial maybe there is a better way to complete this...
                    setTimeout(function() {
                        that.props.onShowResult(imageList[i].resultData)
                    },1)
                }
            }
        } else if(mode === 'FACE') {
            const that = this
            if(isNew === 'new') {
                this.sendFaceRequest(strURL, 0, 'new')
            } else {
                if(JSON.stringify(imageList[i].resultDataOfFace) === '{}') {
                    console.log("third data of face is empty send the face request")
                    this.sendFaceRequest(strURL, i, isNew)
                } else {
                    //wait the canvas initial maybe there is a better way to complete this...
                    setTimeout(function() {
                        that.props.onShowResult(imageList[i].resultDataOfFace)
                    },1)
                }
            }
        }
    }

    componentDidMount() {
        const that = this;
        $('#file').on('change', function(){
            var file = this.files[0];
        	if(file) {
                const name = file.name;
          		var url = window.URL.createObjectURL(file);
                that.setState((state) => {
                    //concat all properties otherwise the new iamge's properties will be undefine
                    state.imageList = state.imageList.concat([{url: url, resultData: {}, resultDataOfFace: {}}])
                    state.selectedImage = state.imageList.length - 1
                })
                that.props.onLoadingImage()
                that.sendRequestInMode(that.props.mode, file, 0, url, 'new');
            }

        })
    }

    sendFaceRequest = (file, url, index, isNew) => {
        const that = this;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            var imgBlob = xhr.response;
            var fd = new FormData();
            fd.append('file', imgBlob);
            var xhr2 = new XMLHttpRequest();
            xhr2.open("POST", "http://demo.codvision.com:16802/api/demoface");
            xhr2.onload = function() {
                const data = xhr2.response;
                const jsonData = JSON.parse(data);
                if(isNew === 'new') {
                    that.setState((state) => {
                        state.imageList[state.selectedImage].resultDataOfFace = jsonData
                    })
                } else {
                    that.setState((state) => {
                        state.imageList[index].resultDataOfFace = jsonData
                    })
                }
                that.props.onShowResult(jsonData);
            }
            xhr2.onerror = function() {
                console.log('post error');
                //when the post failed add invalid image to resultDataOfFace
                that.setState((state) => {
                    state.imageList[state.selectedImage].resultDataOfFace = {similarity: 'Invalid Image'};
                });
                that.props.onShowResult({});
            }
            xhr2.send(fd);
        };
        xhr.onerror = function() {
            console.log('face get wrong!');
        };
        xhr.send();
    }

    sendFileRequest = (file, url, index, isNew) => {
        const that = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `http://demo.codvision.com:16831/api/detectimage?usrname=fj&taskname=task1&filename=${file.name}`);
        var data = new FormData();
        data.append('file', file);
        xhr.send(data);
        xhr.onload = function() {
            const jsonData = JSON.parse(xhr.response);
            if(isNew === 'new') {
                that.setState((state) => {
                    state.imageList[state.selectedImage].resultData = jsonData
                })
            } else {
                that.setState((state) => {
                    state.imageList[index].resultData = jsonData
                })
            }
            that.props.onShowResult(jsonData)
        }
        xhr.onerror = function() {
            console.log('post failed');
            //post failed set number=0 to end the process and show the canvas
            that.setState((state) => {
                state.imageList[state.selectedImage].resultData = {number: 0}
            })
            that.props.onShowResult({})
        }
    };

    //second floor changeMode function
    changeMode = (mode) => {
        this.setState((state) => {
            if(this.props.mode === 'GENERAL') {
                state.imageListOfObject = state.imageList
            } else if(this.props.mode === 'FACE') {
                state.imageListOfFace = state.imageList
            }
        })
        const that = this
        if(mode === 'FACE') {
            this.setState((state) => {
                state.imageList = state.imageListOfFace
                state.selectedImage = 0
            })
        } else if(mode === 'GENERAL') {
            this.setState((state) => {
                state.imageList = state.imageListOfObject
                state.selectedImage = 0
            })
        }
        setTimeout(function() {
            that.sendRequestInMode(mode, that.state.selectedImage, that.state.imageList[that.state.selectedImage].url, 'not-new')
        },1)
        this.props.onChangeMode(mode)
    }

    render() {
        return (
            <div id="image-view" className="flex-box" style={{width: '66%', height: '100%', maxHeight:'100%', flex: '1 1 auto', flexDirection: 'column'}}>
                <NavBar onChangeMode={this.changeMode}/>
                <SelectedImage mode={this.props.mode} compareImage={require('../imgs/start.jpg')} selectedImage={this.state.imageList.length > 0 ? this.state.imageList[this.state.selectedImage].url : null}/>
                <SelectBar onClickItem={this.clickItem} imageList={this.state.imageList} selectedImage={this.state.selectedImage}/>
            </div>
        )
    }
}

export default ImageView
