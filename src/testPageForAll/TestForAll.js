import React, { Component } from 'react';
import SelectedImage from './components/SelectedImage';
import SelectBar from './components/SelectBar';
import TagView from './components/TagView';
import WaitingPage from '../WaitingPage';

class TestForAll extends Component {
  state = {
    imageList: [],
    boxList: [],
    selectedImageNum: 0,
    boxIndex: 0,
    showWaitingPage: false,
    modeList: ['车牌检测与识别'],
    testMode: 0
  }

  handleTestModeChange = (e) => {
    this.setState({
      testMode: e.target.value
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
          if(this.state.testMode === 0) {
            fetch(`${this.props.defaultURL}demoplaterecog?filename=${file.name}`, {
              method: 'POST',
              body: formData
            }).then((response) => response.text())
              .then((result) => {
                console.log(result);
              })
              .catch((error) => {
                console.log(error);
              })
          }
      }
  }

  showNewImage = (url, name) => {
      this.setState({
        imageList: this.state.imageList.concat([{url, name}])
      });
  }

  getBoxList = (index) => {
    let boxList = [];
    fetch(`${encodeURI(`${this.props.defaultURL}loadtestlabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`)}`)
      .then((response) => response.json())
      .then((result) => {
        if(result.length > 0) {
          boxList = result.objects;
        }
        this.setState({
          boxList
        })
      })
  }

  clickItem = (url) => {
      this.changeBoxIndex(0);
      const preIndex = this.state.selectedImageNum;
      const that = this;
      for(let i=0; i<this.state.imageList.length; i++) {
          if(this.state.imageList[i].url === url) {
              this.setState((state) => {
                  state.selectedImageNum = i
                  this.getBoxList(i);
              }, function() {
                  that.refs.selectedImage.initSelectedImage();
                  //that.refs.tagView.changeAutoTagStart(that.state.selectedImageNum + that.refs.taView.state.start);
              })
              break
          }
      }
  }

  getBoxList = (index) => {
      const that = this;
      let boxList = [];
      const tagListRequest = new XMLHttpRequest();
      tagListRequest.open('GET',
      encodeURI(`${that.props.defaultURL}loadlabel?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.imageList[index].name}`));
      tagListRequest.send();
      tagListRequest.onload = function() {
          const jsonResponse = JSON.parse(tagListRequest.response);
          if(jsonResponse.length > 0) {
              boxList = jsonResponse.objects;
          }
          that.setState({boxList})
      }
      tagListRequest.onerror = function() {
          that.setState({boxList: []});
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
      <div className="flex-box full-height" style={{width: '100%', overflow: 'hidden'}}>
          {this.state.showWaitingPage && <WaitingPage text="检测中" />}
          <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%', position: 'relative'}}>
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
          <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
              <TagView ref="tagView"
                 imageList={this.state.imageList}
                 boxIndex={this.state.boxIndex}
                 changeBoxIndex={this.changeBoxIndex}
                 selectedImage={this.props.selectedImage}
                 selectedImageNum={this.props.selectedImageNum}
                 getBoxList={this.props.getTagList}
                 info={this.props.info}
                 boxList={this.state.boxList}
                 defaultURL={this.props.defaultURL}
                 userName={this.props.userName}
                 userLevel={this.props.userLevel}
                 testMode={this.state.testMode}
                 handleTestModeChange={this.handleTestModeChange} />
          </div>
      </div>
    )
  }
}

export default TestForAll;
