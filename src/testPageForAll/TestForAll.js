import React, { Component } from 'react';
import SelectedImage from './components/SelectedImage';
import SelectBar from './components/SelectBar';
import TagView from './components/TagView';
import WaitingPage from '../WaitingPage';

class TestForAll extends Component {
  state = {
    imageList: [],
    allBoxList: [],
    boxList: [],
    selectedImageNum: 0,
    boxIndex: 0,
    showWaitingPage: false,
    testMode: 0
  }

  handleTestModeChange = (e) => {
    this.setState({
      testMode: e.target.value,
      imageList: [],
      allBoxList: [],
      boxList: [],
      selectedImageNum: 0,
      boxIndex: 0,
    })
  }

  getURL = () => {
    switch (this.state.testMode) {
      case 0: return 'demoplaterecog';
      case 1: return 'demosealrecog';
    }
  }

  uploadImageFiles = (files) => {
      const that = this;
      for(const file of files) {
          if(!file.type.match('image.*')) {
              continue;
          }
          const formData = new FormData();
          formData.append("file", file);
          this.setState({
            showWaitingPage: true,
            boxList: []
          })
          fetch(`${this.props.defaultURL}${this.getURL()}?filename=${file.name}`, {
            method: 'POST',
            body: formData
          }).then((res) => {
            if(res.ok) {
              res.json().then((result) => {
                if(result.length > 0) {
                  this.setState({
                    showWaitingPage: false,
                    allBoxList: [
                      ...this.state.allBoxList,
                      result.objects
                    ],
                    boxList: result.objects,
                    selectedImageNum: this.state.imageList.length - 1
                  })
                } else {
                  this.setState({
                    showWaitingPage: false,
                    allBoxList: [
                      ...this.state.allBoxList,
                      []
                    ],
                    boxList: [],
                    selectedImageNum: this.state.imageList.length - 1
                  })
                }
              })
            } else {
              this.setState({
                showWaitingPage: false,
                imageList: this.state.imageList.slice(0, this.state.imageList.length - 1)
              }, () => {
                this.setState({
                  selectedImageNum: this.state.imageList.length - 1
                })
                window.alert('该图检测错误，请尝试更换图片。');
              })
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }
  }

  showNewImage = (url, name) => {
      this.setState({
        imageList: this.state.imageList.concat([{url, name}])
      }, () => {
        this.setState({
          selectedImageNum: this.state.imageList.length - 1
        })
      });
  }

  getBoxList = () => {
    this.setState({
      boxList: this.state.allBoxList[this.state.selectedImageNum]
    })
  }

  clickItem = (url) => {
      this.changeBoxIndex(0);
      const preIndex = this.state.selectedImageNum;
      for(let i=0; i<this.state.imageList.length; i++) {
          if(this.state.imageList[i].url === url) {
            this.setState({
              selectedImageNum: i
            }, () => {
              this.getBoxList();
              this.refs.selectedImage.initSelectedImage();
            })
            break
          }
      }
  }

  previousImage = () => {
    this.changeBoxIndex(0);
    const that = this, preIndex = this.state.selectedImageNum;
    if(preIndex - 1 >= 0) {
        this.setState((state) => {
            state.selectedImageNum = preIndex - 1;
            that.getBoxList(preIndex - 1);
        }, function() {
            that.refs.selectedImage.initSelectedImage();
        })
    }
  }

  nextImage = () => {
    this.changeBoxIndex(0);
    const that = this, preIndex = this.state.selectedImageNum;
    if(preIndex + 1 < this.state.imageList.length) {
        this.setState((state) => {
            state.selectedImageNum = preIndex + 1;
            that.getBoxList(preIndex + 1);
        }, function() {
            that.refs.selectedImage.initSelectedImage();
        })
    }
  }

  changeBoxIndex = (boxIndex) => {
    this.setState({
      boxIndex
    })
  }

  render() {
    return (
      <div className="flex-box full-height layout-in-small" style={{width: '100%', overflow: 'hidden'}}>
          {this.state.showWaitingPage && <WaitingPage text="检测中" />}
          <div className="flex-box flex-column full-height full-width-in-small" style={{flex: '1 1 auto', width: '80%', position: 'relative'}}>
              <div style={{zIndex: '100000', height: '47px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 0px', position: 'absolute', top: '0px', left: '0px', width: '100%', background: 'rgb(48,48,48)', color: 'white'}}>
                {this.state.imageList.length > 0
                  ? `第 ${this.state.selectedImageNum + 1} 张 ${this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].name : ''}`
                  : ''}
              </div>
              <SelectedImage
                 ref="selectedImage"
                 boxIndex={this.state.boxIndex}
                 getImageList={this.getImageList}
                 onNextImage={this.nextImage}
                 onPreviousImage={this.previousImage}
                 selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                 complete={this.props.complete}
                 uploadImageFiles={this.uploadImageFiles}
                 onShowNewImage={this.showNewImage}
                 boxList={this.state.boxList}
                 defaultURL={this.props.defaultURL}
                 userName={this.props.userName}
                 userLevel={this.props.userLevel}
                 taskName={this.props.taskName}/>
              <SelectBar
                onClickItem={this.clickItem}
                selectedImageNum={this.state.selectedImageNum}
                imageList={this.state.imageList}/>
          </div>
          <div className="flex-box flex-column full-width-in-small" style={{width: '20%', backgroundColor: '#F6F6F6'}}>
              <TagView ref="tagView"
                 imageList={this.state.imageList}
                 boxIndex={this.state.boxIndex}
                 changeBoxIndex={this.changeBoxIndex}
                 selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                 selectedImageNum={this.state.selectedImageNum}
                 boxList={this.state.boxList}
                 testMode={this.state.testMode}
                 handleTestModeChange={this.handleTestModeChange} />
          </div>
      </div>
    )
  }
}

export default TestForAll;
