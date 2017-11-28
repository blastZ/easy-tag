import React, { Component } from 'react';
import SelectedImage from './SelectedImage';
import SelectBar from './SelectBar';
import TagView from './TagView';

class Test extends Component {
  state = {
    imageList: [],
    boxList: [],
    selectedImageNum: 0
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
          fileRequest.open('POST', `${that.props.defaultURL}uploadtestfile?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${file.name}`);
          fileRequest.send(formData);
          fileRequest.onload = function() {
              console.log('post image success.');
          }
          fileRequest.onerror = function() {
              console.log('post image failed.');
          }
      }
  }

  showNewImage = (url, name) => {
      this.setState({
        imageList: this.state.imageList.concat([{url, name}])
      });
  }

  autoTagImages = (start, num, pretrainmodel) => {
    fetch(`${this.props.defaultURL}autolabelimage?usrname=${this.props.userName}&taskname=${this.props.taskName}&start=${start}&num=${num}&pretrainmodel=${pretrainmodel}`)
      .then((response) => (response.text()))
      .then((result) => {
        console.log(result);
      })
  }

  clickItem = (url) => {
      //this.changeBoxIndex(0);
      const preIndex = this.state.selectedImageNum;
      const that = this;
      for(let i=0; i<this.state.imageList.length; i++) {
          if(this.state.imageList[i].url === url) {
              this.setState((state) => {
                  state.selectedImageNum = i
                  //this.getTagList(i);
              }, function() {
                  that.refs.selectedImage.initSelectedImage();
                  //that.tagView.changeAutoTagStart(that.state.selectedImageNum + that.state.start);
              })
              break
          }
      }
  }

  getTagList = (index) => {
      const that = this;
      let boxList = [];
      try {
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
              console.log('get boxList error.');
              that.setState({boxList: []});
          }
      } catch(error) {
          console.log(error);
      }
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
          fetch(`${this.state.defaultURL}uploadtestvideo2image?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${file.name}&interval=${interval}`, {
            method: 'POST',
            body: formData
          }).then((response) => response.text())
            .then((result) => {
              // setTimeout(() => {
              //   this.getImageList();
              //   this.shouldShowWaitingPage();
              // }, 6000)
            })
        } else {
          window.alert('视频格式错误');
        }
      }
    }
  }

  render() {
    return (
      <div className="flex-box full-height">
          <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
              <SelectedImage
                 ref="selectedImage"
                 boxIndex={this.props.boxIndex}
                 bindVideoFileEvent={this.bindVideoFileEvent}
                 getImageList={this.getImageList}
                 onNextImage={this.props.nextImage}
                 onPreviousImage={this.props.previousImage}
                 selectedImage={this.state.imageList[this.state.selectedImageNum] ? this.state.imageList[this.state.selectedImageNum].url : ''}
                 selectedImageNumInAll={this.props.selectedImageNumInAll}
                 complete={this.props.complete}
                 uploadImageFiles={this.uploadImageFiles}
                 onShowNewImage={this.showNewImage}
                 boxList={this.props.boxList}
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
                 boxIndex={this.props.boxIndex}
                 changeBoxIndex={this.changeBoxIndex}
                 selectedImage={this.props.selectedImage}
                 selectedImageNum={this.props.selectedImageNum}
                 getBoxList={this.props.getTagList}
                 onHandleNumChange={this.props.handleNumChange}
                 getImageListByTag={this.props.getImageListByTag}
                 onHandleStartChange={this.props.handleStartChange}
                 start={this.props.start}
                 num={this.props.num}
                 info={this.props.info}
                 currentTagString={this.props.currentTagString}
                 onChangeBrowserMode={this.changeBrowserMode}
                 onGetImageList={this.onGetImageList}
                 onNextImageList={this.onNextImageList}
                 onPreviousImageList={this.onPreviousImageList}
                 boxList={this.state.boxList}
                 defaultURL={this.props.defaultURL}
                 userName={this.props.userName}
                 userLevel={this.props.userLevel}
                 taskName={this.props.taskName}
                 autoTagImages={this.autoTagImages} />
          </div>
      </div>
    )
  }
}

export default Test;
