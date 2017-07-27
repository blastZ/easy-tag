import React, { Component } from 'react'
import './css/App.css'
import './css/w3.css'
import $ from 'jquery'
import './css/font-awesome.min.css'
import SelectBar from './SelectBar.js'
import SelectedImage from './SelectedImage.js'
import TagView from './TagView.js'
//import { saveAs } from 'file-saver' when you want to save as txt on the localhost

class App extends Component {
    state = {
        imageList: [{url: require('./imgs/start.jpg'), name: 'start'}],
        tagList: [
            // {x_start: 0, y_start: 0, x_end: 10, y_end: 20, tagString: 'car'} result format
        ],
        currentTagString: '1',
        currentImageName:'',
        selectedImageNum: 0,
        start: 1,
        num: 10,
        complete: 0
    }
    componentDidMount() {
        const that = this;
        this.getImageList();

        ///let user can select directory
        /*
            $('#file').attr('webkitdirectory', 'webkitdirectory');
            $('#file').attr('directory', 'directory');
        */

        //bind upload and show events
        $('#file').on('change', function() {
            const files = this.files;
            //let loadCount = 0; --------maybe use loadCount to setState per 50 times
            for(const file of files) {
                //decide the file is a image or not
                if(file.type === 'image/jpeg' || file.type === 'image/png') {
                    const name = file.name;
                    const reader = new FileReader()
                    reader.onload = function() {
                        const url = this.result;
                        that.setState(that.concatNewImage(url, name));
                    }
                    reader.readAsDataURL(file);
                }
            }
            that.uploadImageFiles(files);
        })
    }

    uploadImageFiles = (files) => {
        for(const file of files) {
            if(!file.type.match('image.*')) {
                continue;
            }
            const formData = new FormData();
            formData.append("file", file);
            const fileRequest = new XMLHttpRequest();
            fileRequest.open('POST', `http://192.168.0.103:8031/api/uploadfile?usrname=fj&taskname=task1&filename=${file.name}`);
            fileRequest.send(formData);
            fileRequest.onload = function() {
                console.log('post success.');
            }
            fileRequest.onerror = function() {
                console.log('post failed.');
            }
        }

    }

    getImageList = () => {
        const that = this;
        //load imageList from server
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://192.168.0.103:8031/api/getdir?usrname=fj&taskname=task1&start=${this.state.start}&num=${this.state.num}`);
        xhr.onload = function() {
            const newImageList = [];
            console.log(xhr.response)
            if(xhr.response) {
                const jsonResponse = JSON.parse(xhr.response);
                jsonResponse.map((image) => {
                    newImageList.push({url: image.url, name: image.name});
                })
            }
            that.setState({imageList: newImageList});
        }
        xhr.onerror = function() {
            console.log('get imageList failed');
        }
        xhr.send();
    }

    deleteImage = () => {
        //delete image from server
        const deleteRequest = new XMLHttpRequest();
        deleteRequest.open('GET', `http://192.168.0.103:8031/api/delfile?usrname=fj&taskname=task1&filename=${this.state.imageList[this.state.selectedImageNum].name}`);
        deleteRequest.send();
    }

    concatNewImage = (url, name) => {
        return (preState) => {
            return {
                imageList: preState.imageList.concat([{url: url, name: name}])
            };
        };
    }

    clickItem = (url) => {
        for(let i=0; i<this.state.imageList.length; i++) {
            if(this.state.imageList[i].url === url) {
                this.setState((state) => {
                    state.selectedImageNum = i
                    state.tagList = []
                })
                this.refs.selectedImage.clearBoxList()
                break
            }
        }
    }

    saveResult = () => {
        // let result = `{length: ${this.state.tagList.length} }`
        // this.state.tagList.map((tag) => {
        //     const x_start = tag.x_start
        //     const y_start = tag.y_start
        //     const x_end = tag.x_end
        //     const y_end = tag.y_end
        //     const tagString = tag.tagString
        //     result = result.concat(`${x_start} `).concat(`${y_start} `).concat(`${x_end} `).concat(`${y_end} `).concat(tagString).concat('\n')
        // })
        const result = `{
            "length": ${this.state.tagList.length},
            "objects": [
                ${this.state.tagList.map((tag) => (
                    `{
                        "x_start": ${tag.x_start},
                        "y_start": ${tag.y_start},
                        "x_end": ${tag.x_end},
                        "y_end": ${tag.y_end},
                        "tag": "${tag.tagString}"
                    }`
                ))}
            ]
        }`

        //var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
        //saveAs(blob, `${this.state.imageList[this.state.selectedImageNum].name}.txt`);
        $.ajax({
            url: 'http://192.168.0.118:8888/api/v1.0',
            type: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: result,
            dataType: 'text/plain',
            success: function(data) {
                console.log(data)
            },
            error: function(data) {
                console.log(data)
            }
        })
    }

    addTag = (tag) => {
        this.setState((state) => {
            state.tagList = state.tagList.concat([tag])
        })
    }

    deleteTag = (index) => {
        this.setState((state) => {
            state.tagList.splice(index, 1)
        })
    }

    changeTagString = () => {
        this.setState({currentTagString: $('#mySelect').val()})
    }

    handleNumChange = (e) => {
        const value = e.target.value;
        this.setState((state) => {
            if(value.trim() === '') {
                state.num = 1;
            } else if(parseInt(value) > 999999) {
                state.num = 999999;
            } else {
                state.num = parseInt(value);
            }
        });
    }

    handleStartChange = (e) => {
        const value = e.target.value;
        this.setState((state) => {
            if(value.trim() === '') {
                state.start = 1;
            } else if(parseInt(value) > 999999) {
                state.start = 999999
            } else {
                state.start = parseInt(value);
            }
        });
    }

    render() {
        return (
            <div className="App flex-box full-height">
                <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                    <SelectedImage num={this.state.num}
                                   ref="selectedImage"
                                   currentTagString={this.state.currentTagString}
                                   onDeleteTag={this.deleteTag}
                                   onAddTag={this.addTag}
                                   selectedImage={this.state.imageList[this.state.selectedImageNum].url}
                                   complete={this.state.complete}
                                   onDeleteImage={this.deleteImage}/>
                    <SelectBar onClickItem={this.clickItem} selectedImageNum={this.state.selectedImageNum} imageList={this.state.imageList}/>
                </div>
                <div style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                    <TagView onHandleNumChange={this.handleNumChange}
                             onHandleStartChange={this.handleStartChange}
                             start={this.state.start}
                             num={this.state.num}
                             currentTagString={this.state.currentTagString}
                             onChangeTagString={this.changeTagString}
                             onSaveResult={this.saveResult}
                             onGetImageList={this.getImageList}/>
                </div>
            </div>
        )
  }
}

export default App
