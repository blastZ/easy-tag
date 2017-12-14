import React, {Component} from 'react';
import $ from 'jquery';
import UploadImageButton from './UploadImageButton';

var mouseupListener;

class SelectedImage extends Component {
    state = {
        imgLoaded: false,
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.nextPreviousImageListener);
        document.removeEventListener('wheel', this.wheelListener);
        document.removeEventListener('mouseup', mouseupListener);
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
              that.props.uploadImageFiles(files);
          } else {
              window.alert('图片命名不符合规则');
          }
      })
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

        let drawing = false
        let x1 = 0, y1 = 0, x_move = 0, y_move = 0
        let rect_width = 0, rect_height = 0
        let offset = {}
        let start = false;
        let previousClientX = 0, previousClientY = 0, currentClientX = 0, currentClientY = 0;
        $('#selectedImagePanel').mousedown(function(e) {
            if(e.which === 3) {
                start = true;
                previousClientX = e.clientX;
                previousClientY = e.clientY;
            }
        })

        $('#selectedImagePanel').mousemove(function(e) {
            if(e.which === 3) {
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
          if(e.which === 3) {
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
        theImage.height += 20;
        theImage.style.left = (parseInt(theImage.style.left) - 5).toString() + 'px';
        theImage.style.top = (parseInt(theImage.style.top) - 5).toString() + 'px';
    }

    decreaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        theImage.height -= 20;
        theImage.style.left = (parseInt(theImage.style.left) + 5).toString() + 'px';
        theImage.style.top = (parseInt(theImage.style.top) + 5).toString() + 'px';
    }

    getBoxX = (r_x_start) => {
        const img = document.getElementById('selectedImage');
        const img_width = img.width;
        const img_left = parseInt(img.style.left);
        return (img_width * r_x_start + img_left);
    }

    getBoxY = (r_y_start) => {
        const img = document.getElementById('selectedImage');
        const img_height = img.height;
        const img_top = parseInt(img.style.top);
        return (img_height * r_y_start + img_top);
    }

    getBoxWidth = (r_x_start, r_x_end) => {
        const img_width = document.getElementById('selectedImage').width;
        const x_start = img_width * r_x_start;
        const x_end = img_width * r_x_end;
        return (x_end - x_start);
    }

    getBoxHeight = (r_y_start, r_y_end) => {
        const img_height = document.getElementById('selectedImage').height;
        const y_start = img_height * r_y_start;
        const y_end = img_height * r_y_end;
        return (y_end - y_start);
    }

    drawBoxList = () => {
        return (
            this.props.boxList.length > 0 ?
            this.props.boxList.map((box, index) => (
                <div className="black-white-border" key={box.x_start + box.y_end} style={{width: `${this.getBoxWidth(box.x_start, box.x_end)}px`, height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                             position: 'absolute', left: `${this.getBoxX(box.x_start)}px`, top: `${this.getBoxY(box.y_start)}px`}}>
                             {this.props.boxIndex === index && <span className="tag-title"><b>No.{index + 1}<br/>{box.tag[0]}</b></span>}
                </div>
            )) : null
        );
    }

    render() {
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1'}}>
                <div id="selectedImagePanel" style={{position: 'relative', width: '1200px', height: '600px', overflow: 'hidden', zIndex:'0'}}>
                    <img draggable="false" id="selectedImage" className="normal-cursor" src={this.props.selectedImage} alt={this.props.selectedImage} style={{position: 'absolute'}}/>
                    {
                        this.state.imgLoaded ? this.drawBoxList() : null
                    }
                </div>
                <UploadImageButton />
            </div>
        )
    }
}

export default SelectedImage
