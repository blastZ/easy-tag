import React, {Component} from 'react';
import $ from 'jquery';
import UploadImageButton from './UploadImageButton';
import ImgTopBar from './ImgTopBar';
import { DEFAULT_URL } from './utils/global_config';

var mouseupListener = '';

class SelectedObjectImage extends Component {
    state = {
        fileCount: 0,
        tagedFileCount: 0,
        imgLoaded: false
    }

    bindFileEvent = () => {
      const that = this;
      $('#file').on('change', function() {
          const files = this.files;
          let result = true;
          for(const file of files) {
              if((/^[a-zA-Z0-9\-\_\.\u4e00-\u9fa5]+$/).test(file.name) === false) {
                  result = false;
              }
          }
          if(result) {
              for(const file of files) {
                  //decide the file is a image or not
                  if(file.type === 'image/jpeg' || file.type === 'image/png') {
                      const name = file.name;
                      const reader = new FileReader()
                      reader.onload = function() {
                          const url = this.result;
                          that.props.onShowNewImage(url, name);
                      }
                      reader.readAsDataURL(file);
                  }
              }
              that.props.onUploadImgeFiles(files);
          } else {
              window.alert('图片命名不符合规则');
          }
      })
    }

    componentWillMount() {
        this.getFileCount();
        this.getTagedFileCount();
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.deleteImageListener);
        document.removeEventListener('keyup', this.nextPreviousImageListener);
        document.removeEventListener('wheel', this.wheelListener);
        document.removeEventListener('mouseup', mouseupListener);
    }

    deleteImageListener = (e) => {
        if(e.keyCode === 46) {
            this.props.onDeleteImage();
        }
    }

    nextPreviousImageListener = (e) => {
        if(e.keyCode === 37) {
            this.props.onPreviousImage();
        } else if(e.keyCode === 39) {
            this.props.onNextImage();
        }
    }

    initSelectedImage = () => {
        const theImage = document.getElementById('selectedImage');
        const container = document.getElementById('selectedImagePanel');

        if(theImage.naturalHeight > 600) {
            theImage.height = 600;
        } else {
            theImage.height = theImage.naturalHeight;
        }
        theImage.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
        theImage.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
    }

    componentDidMount() {
        const that = this;
        const theImage = document.getElementById('selectedImage');
        const container = document.getElementById('selectedImagePanel');

        container.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        theImage.onload = function() {
            const container = document.getElementById('selectedImagePanel');
            container.width = 1200;
            container.height = 600;
            if(theImage.height > 600) {
                theImage.height = 600;
            }
            theImage.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
            theImage.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
            that.setState({imgLoaded: true});
        }

        document.addEventListener('keyup', this.deleteImageListener);
        document.addEventListener('keyup', this.nextPreviousImageListener);

        //bind upload and show events
        this.bindFileEvent();
        let start = false;
        let previousClientX = 0, previousClientY = 0, currentClientX = 0, currentClientY = 0;
        $('#selectedImagePanel').mousedown(function(e) {
            if(e.which === 1) {
                start = true;
                previousClientX = e.clientX;
                previousClientY = e.clientY;
            }
        })

        $('#selectedImagePanel').mousemove(function(e) {
            if(e.which === 1) {
                if(start) {
                    currentClientX = e.clientX;
                    currentClientY = e.clientY;
                    theImage.style.left = (parseInt(theImage.style.left) + currentClientX - previousClientX).toString() + 'px';
                    theImage.style.top = (parseInt(theImage.style.top) + currentClientY - previousClientY).toString() + 'px';
                    previousClientX = e.clientX;
                    previousClientY = e.clientY;
                    that.forceUpdate();
              }
            }
        })

        mouseupListener = function(e) {
          if(e.which === 1) {
              start = false;
              that.forceUpdate();
          }
        }
        document.addEventListener('mouseup', mouseupListener);
        container.addEventListener('wheel', this.wheelListener);
    }

    wheelListener = (e) => {
      e.wheelDeltaY > 0 ? this.increaseImageSize() : this.decreaseImageSize();
      this.forceUpdate();
    }

    increaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        theImage.height += 10;
        theImage.style.left = (parseInt(theImage.style.left) - 5).toString() + 'px';
        theImage.style.top = (parseInt(theImage.style.top) - 5).toString() + 'px';
    }

    decreaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        theImage.height -= 10;
        theImage.style.left = (parseInt(theImage.style.left) + 5).toString() + 'px';
        theImage.style.top = (parseInt(theImage.style.top) + 5).toString() + 'px';
    }

    getFileCount = () => {
        const that = this;
        const getFileCount = new XMLHttpRequest();
        getFileCount.open('GET', `${DEFAULT_URL}filecount?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
        getFileCount.send();
        getFileCount.onload = function() {
            console.log('getFileCount success.');
            const theFileCount = getFileCount.response;
            that.setState({fileCount: theFileCount});
        }
    }

    getTagedFileCount = () => {
        const that = this;
        const getTagedFileCount = new XMLHttpRequest();
        getTagedFileCount.open('GET', `${DEFAULT_URL}labeledfilecount?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
        getTagedFileCount.send();
        getTagedFileCount.onload = function() {
            console.log('getTagedFileCount success.');
            const theTagedFileCount = getTagedFileCount.response;
            that.setState({tagedFileCount: theTagedFileCount});
        }
    }

    render() {
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1'}}>
              <ImgTopBar
                tagedFileCount={this.state.tagedFileCount}
                fileCount={this.state.fileCount}
                index={this.props.selectedImageNumInAll}
                name={this.props.selectedImageName}
                userLevel={this.props.userLevel}
                deleteSameImage={this.props.deleteSameImage}
                onDeleteImage={this.props.onDeleteImage} />
                <div id="selectedImagePanel" style={{position: 'relative', width: '1200px', height: '600px', overflow: 'hidden'}}>
                    <img draggable="false" id="selectedImage" className="et-cursor-move" src={this.props.selectedImage} alt={this.props.selectedImage} style={{position: 'absolute'}}/>
                </div>
                {
                    this.props.userLevel !== 0
                      ? <UploadImageButton
                          bindVideoFileEvent={this.props.bindVideoFileEvent}
                          defaultURL={DEFAULT_URL}
                          userName={this.props.userName}
                          taskName={this.props.taskName}
                          getImageList={this.props.getImageList}
                          bindFileEvent={this.bindFileEvent} />
                      : null
                }
            </div>
        )
    }
}

export default SelectedObjectImage
