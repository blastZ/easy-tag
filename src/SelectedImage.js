import React, {Component} from 'react';
import $ from 'jquery';
import UploadImageButton from './UploadImageButton';
import ImgTopBar from './ImgTopBar';
import ImgBotBar from './ImgBotBar';
import { DEFAULT_TAG_SIZE } from './utils/global_config';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { DEFAULT_URL } from './utils/global_config';

var mouseupListener;

const styles = {

}

class SelectedImage extends Component {
    state = {
        fileCount: 0,
        tagedFileCount: 0,
        imgLoaded: false,
        drawing: false,
        moving: false,
        startPoint: {x: 0, y: 0},
        endPoint: {x: 0, y: 0},
        moveRecX: 0,
        moveRecY: 0,
        moveRecWidth: 0,
        moveRecHeight: 0,
        moveBox: false,
        resizing: false,
        movePoint: {x: 0, y: 0},
        theBox: null,
        onLeftEdge: false,
        onTopEdge: false,
        onRightEdge: false,
        onBottomEdge: false,
        imgStatus: "test...",
        theRefreshInterval: null,
        optionBox: {
          x: 0,
          y: 0,
          left: 40,
          top: 170,
        },
        moveOptionBox: false
    }

    componentWillMount() {
        this.getFileCount();
        this.getTagedFileCount();
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.deleteImageListener);
        document.removeEventListener('keyup', this.nextPreviousImageListener);
        document.removeEventListener('mouseup', mouseupListener);

        window.clearInterval(this.state.theRefreshInterval);

        this.removeDragListener();
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

    handleMouseDown = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const image = document.getElementById('selectedImage');
      const panel = document.getElementById('selectedImagePanel');
      if(e.buttons === 1) {
        const rec = image.getBoundingClientRect();
        const panelRec = panel.getBoundingClientRect();
        const offsetXPanel = panelRec.left;
        const offsetYPanel = panelRec.top;
        const offsetX = rec.left;
        const offsetY = rec.top;
        const x = clientX - offsetX;
        const y = clientY - offsetY;
        if(x >= 0 && y >= 0) {
          this.setState({
            drawing: true,
            startPoint: {x,y},
            endPoint: {x,y},
            moveRecX: clientX - offsetXPanel,
            moveRecY: clientY - offsetYPanel,
            moveRecWidth: 0,
            moveRecHeight: 0,
          })
        }
      }
    }

    handleMouseMove = (e) => {
      if(this.state.drawing) {
        const clientX = e.clientX;
        const clientY = e.clientY;
        const image = document.getElementById('selectedImage');
        const panel = document.getElementById('selectedImagePanel');
        if(e.buttons === 1) {
          const rec = image.getBoundingClientRect();
          const panelRec = panel.getBoundingClientRect();
          const offsetXPanel = panelRec.left;
          const offsetYPanel = panelRec.top;
          const offsetX = rec.left;
          const offsetY = rec.top;
          const left = offsetX - offsetXPanel;
          const top = offsetY - offsetYPanel;
          const x = clientX - offsetX;
          const y = clientY - offsetY;
          this.setState({
            endPoint: {x, y}
          }, () => {
            const { startPoint, endPoint } = this.state;
            if(endPoint.x > startPoint.x && endPoint.y < startPoint.y) {
              const overflowX = endPoint.x > rec.width;
              const overflowY = endPoint.y < 0;
              if(overflowX || overflowY) {
                const moveRecX = startPoint.x + offsetX - offsetXPanel;
                const moveRecY = overflowY ? offsetY - offsetYPanel : this.state.endPoint.y + offsetY - offsetYPanel;
                const moveRecWidth = overflowX ? rec.width - this.state.startPoint.x : this.state.endPoint.x - this.state.startPoint.x;
                const moveRecHeight = overflowY ? this.state.startPoint.y : this.state.startPoint.y - this.state.endPoint.y;
                const endPoint = {
                  x: overflowX ? rec.width : this.state.endPoint.x,
                  y: overflowY ? 0 : this.state.endPoint.y
                }
                this.setState({moveRecX, moveRecY, moveRecWidth, moveRecHeight, endPoint})
              } else {
                this.setState({
                  moveRecX: startPoint.x + offsetX - offsetXPanel,
                  moveRecY: endPoint.y + offsetY - offsetYPanel,
                  moveRecWidth: endPoint.x - startPoint.x,
                  moveRecHeight: startPoint.y - endPoint.y
                })
              }
            } else if(endPoint.x > startPoint.x && endPoint.y > startPoint.y) {
              const overflowX = endPoint.x > rec.width;
              const overflowY = endPoint.y > rec.height;
              if(overflowX || overflowY) {
                const moveRecX = startPoint.x + offsetX - offsetXPanel;
                const moveRecY = startPoint.y + offsetY - offsetYPanel;
                const moveRecWidth = overflowX ? rec.width - this.state.endPoint.x : this.state.endPoint.x - this.state.startPoint.x;
                const moveRecHeight = overflowY ? rec.height - this.state.endPoint.y : this.state.endPoint.y - this.state.startPoint.y;
                const endPoint = {
                  x: overflowX ? rec.width : this.state.endPoint.x,
                  y: overflowY ? rec.height : this.state.endPoint.y
                }
                this.setState({moveRecX, moveRecY, moveRecWidth, moveRecHeight, endPoint})
              } else {
                this.setState({
                  moveRecX: startPoint.x + offsetX - offsetXPanel,
                  moveRecY: startPoint.y + offsetY - offsetYPanel,
                  moveRecWidth: endPoint.x - startPoint.x,
                  moveRecHeight: endPoint.y - startPoint.y
                })
              }

            } else if(endPoint.x < startPoint.x && endPoint.y > startPoint.y) {
              const overflowX = endPoint.x < 0;
              const overflowY = endPoint.y > rec.height;
              if(overflowX || overflowY) {
                const moveRecX = overflowX ? offsetX - offsetXPanel : this.state.endPoint.x + offsetX - offsetXPanel;
                const moveRecY = startPoint.y + offsetY - offsetYPanel;
                const moveRecWidth = overflowX ? this.state.startPoint.x : this.state.startPoint.x - this.state.endPoint.x;
                const moveRecHeight = overflowY ? rec.height - this.state.startPoint.y : this.state.endPoint.y - this.state.startPoint.y;
                const endPoint = {
                  x: overflowX ? 0 : this.state.endPoint.x,
                  y: overflowY ? rec.height : this.state.endPoint.y
                }
                this.setState({moveRecX, moveRecY, moveRecWidth, moveRecHeight, endPoint})
              } else {
                this.setState({
                  moveRecX: endPoint.x + offsetX - offsetXPanel,
                  moveRecY: startPoint.y + offsetY - offsetYPanel,
                  moveRecWidth: startPoint.x - endPoint.x,
                  moveRecHeight: endPoint.y - startPoint.y
                })
              }
            } else if(endPoint.x < startPoint.x && endPoint.y < startPoint.y) {
              const overflowX = endPoint.x < 0;
              const overflowY = endPoint.y < 0;
              if(overflowX || overflowY) {
                const moveRecX = overflowX ? offsetX - offsetXPanel : this.state.endPoint.x + offsetX - offsetXPanel;
                const moveRecY = overflowY ? offsetY - offsetYPanel : this.state.endPoint.y + offsetY - offsetYPanel;
                const moveRecWidth = overflowX ? this.state.startPoint.x : this.state.startPoint.x - this.state.endPoint.x;
                const moveRecHeight = overflowY ? this.state.startPoint.y : this.state.startPoint.y - this.state.endPoint.y;
                const endPoint = {
                  x: overflowX ? 0 : this.state.endPoint.x,
                  y: overflowY ? 0 : this.state.endPoint.y
                }
                this.setState({moveRecX, moveRecY, moveRecWidth, moveRecHeight, endPoint})
              } else {
                this.setState({
                  moveRecX: endPoint.x + offsetX - offsetXPanel,
                  moveRecY: endPoint.y + offsetY - offsetYPanel,
                  moveRecWidth: startPoint.x - endPoint.x,
                  moveRecHeight: startPoint.y - endPoint.y
                })
              }
            }
          })
        }
      }
    }

    handleMouseUp = (e) => {
      if(e.buttons === 0) {
        if(this.state.drawing) {
          this.addNewBox();
        }
      }
    }

    addNewBox = () => {
      const { startPoint, endPoint } = this.state;
      const width = Math.abs(endPoint.x - startPoint.x);
      const height = Math.abs(endPoint.y - startPoint.y);
      if(width > DEFAULT_TAG_SIZE || height > DEFAULT_TAG_SIZE) {
        const image = document.getElementById('selectedImage');
        const img_natural_width = image.width;
        const img_natural_height = image.height;
        const x_start = startPoint.x > endPoint.x ? endPoint.x : startPoint.x;
        const y_start = startPoint.y > endPoint.y ? endPoint.y : startPoint.y;
        const x_end = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;
        const y_end = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
        const relative_x_start = (x_start / img_natural_width).toFixed(3);
        const relative_y_start = (y_start / img_natural_height).toFixed(3);
        const relative_x_end = (x_end / img_natural_width).toFixed(3);
        const relative_y_end = (y_end / img_natural_height).toFixed(3);
        const tag = {x_start: relative_x_start, y_start: relative_y_start, x_end: relative_x_end, y_end: relative_y_end, tag: [this.props.currentTag], info: this.props.info ? this.props.info : '', tagger: this.props.userName}
        this.props.onAddTag(tag);
      }
      this.initDrawState();
    }

    initDrawState = () => {
      this.setState({
        drawing: false,
        startPoint: {x: 0, y: 0},
        endPoint: {x: 0, y: 0},
        moveRecX: 0,
        moveRecY: 0,
        moveRecWidth: 0,
        moveRecHeight: 0,
      })
    }

    initImage = (e) => {
      const theImage = e.target;
      const container = document.getElementById('selectedImagePanel');
      container.width = 1200;
      container.height = 600;
      if(theImage.height > 600) {
          theImage.height = 600;
      }
      theImage.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
      theImage.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
      this.setState({imgLoaded: true});
    }

    componentDidMount() {
        this.addDragListener();
        this.props.changeBoxIndex(0);
        const that = this;
        const theImage = document.getElementById('selectedImage');
        const container = document.getElementById('selectedImagePanel');

        document.addEventListener('keyup', this.deleteImageListener);
        document.addEventListener('keyup', this.nextPreviousImageListener);

        //bind upload and show events
        this.bindFileEvent();

        let drawing = false;
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

        const theRefreshInterval = window.setInterval(this.refreshInterval, 10000);
        this.setState({theRefreshInterval});

    }

    refreshInterval = () => {
      this.getImageStatus();
    }

    wheelListener = (e) => {
      e.deltaY < 0 ? this.increaseImageSize() : this.decreaseImageSize();
      this.forceUpdate();
    }

    increaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        theImage.height += 20;
        theImage.style.left = `${parseFloat(theImage.style.left, 10) - 5}px`;
        theImage.style.top = `${parseFloat(theImage.style.top, 10) - 5}px`;
    }

    decreaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        theImage.height -= 20;
        theImage.style.left = `${parseFloat(theImage.style.left, 10) + 5}px`;
        theImage.style.top = `${parseFloat(theImage.style.top, 10) + 5}px`;
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

    getImageStatus = () => {
      const that = this;
      const getImageStatus = new XMLHttpRequest();
      getImageStatus.open('GET', `${DEFAULT_URL}getscrapystat?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
      getImageStatus.send();
      getImageStatus.onload = function() {
          console.log('getImageStatus success.');
          const theImageStatus = getImageStatus.response;
          that.setState({imgStatus: theImageStatus});
      }
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

    toRelativeAndChange = (box) => {
      const image = document.getElementById('selectedImage');
      const imageRec = image.getBoundingClientRect();
      const boxRec = box.getBoundingClientRect();
      const x_start = ((boxRec.x - imageRec.x) / imageRec.width).toFixed(3);
      const y_start = ((boxRec.y - imageRec.y) / imageRec.height).toFixed(3);
      const x_end = ((boxRec.x + boxRec.width - imageRec.x) / imageRec.width).toFixed(3);
      const y_end = ((boxRec.y + boxRec.height - imageRec.y) / imageRec.height).toFixed(3);
      this.props.changeBox(this.props.boxIndex, x_start, y_start, x_end, y_end);
    }

    handleBoxMouseDown = (e) => {
      if(e.target.tagName === 'DIV') {
        const { onLeftEdge, onTopEdge, onRightEdge, onBottomEdge } = this.state;
        if(onLeftEdge || onTopEdge || onRightEdge || onBottomEdge) {
          this.setState({
            resizing: true,
            theBox: e.target
          })
        } else {
          this.setState({
            moving: true,
            movePoint: {x: e.clientX, y: e.clientY},
            theBox: e.target
          })
        }
      }
    }

    handleBoxMouseMove = (e) => {
      if(this.state.moving && this.state.theBox) {
        const box = this.state.theBox;
        let left = parseFloat(box.style.left, 10);
        let top = parseFloat(box.style.top, 10);
        const offsetX = Math.abs(e.clientX - this.state.movePoint.x);
        const offsetY = Math.abs(e.clientY - this.state.movePoint.y);
        if(e.clientX > this.state.movePoint.x) {
          left = left + offsetX;
        } else {
          left = left - offsetX;
        }
        if(e.clientY > this.state.movePoint.y) {
          top = top + offsetY;
        } else {
          top = top - offsetY;
        }
        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        this.setState({
          movePoint: {x: e.clientX, y: e.clientY}
        })
      }
      if(this.state.resizing && this.state.theBox) {
        const MARGIN = 6;
        const { onLeftEdge, onTopEdge, onRightEdge, onBottomEdge } = this.state;
        const box = this.state.theBox;
        const rec = box.getBoundingClientRect();
        if(onRightEdge && !onTopEdge && !onBottomEdge) {
          const move_x = e.clientX - rec.x - rec.width;
          box.style.width = `${parseFloat(box.style.width, 10) + move_x}px`;
        } else if(onBottomEdge && !onRightEdge && !onLeftEdge) {
          const move_y = e.clientY - rec.y - rec.height;
          box.style.height = `${parseFloat(box.style.height, 10) + move_y}px`;
        } else if(onLeftEdge && !onBottomEdge && !onTopEdge) {
          if(e.clientX < rec.x) {
            const move_x = rec.x - e.clientX;
            box.style.left = `${parseFloat(box.style.left, 10) - move_x}px`
            box.style.width = `${parseFloat(box.style.width, 10) + move_x}px`
          } else {
            if(e.clientX < rec.x + rec.width - MARGIN) {
              const move_x = e.clientX - rec.x;
              box.style.left = `${parseFloat(box.style.left, 10) + move_x}px`
              box.style.width = `${parseFloat(box.style.width, 10) - move_x}px`
            }
          }
        } else if(onTopEdge && !onLeftEdge && !onRightEdge) {
          if(e.clientY < rec.y) {
            const move_y = rec.y - e.clientY;
            box.style.top = `${parseFloat(box.style.top, 10) - move_y}px`
            box.style.height = `${parseFloat(box.style.height, 10) + move_y}px`
          } else {
            if(e.clientY < rec.y + rec.height - MARGIN) {
              const move_y = e.clientY - rec.y;
              box.style.top = `${parseFloat(box.style.top, 10) + move_y}px`
              box.style.height = `${parseFloat(box.style.height, 10) - move_y}px`
            }
          }
        } else if(onRightEdge && onBottomEdge) {
          const move_x = e.clientX - rec.x - rec.width;
          const move_y = e.clientY - rec.y - rec.height;
          box.style.width = `${parseFloat(box.style.width, 10) + move_x}px`;
          box.style.height = `${parseFloat(box.style.height, 10) + move_y}px`;
        } else if(onTopEdge && onRightEdge) {
          const move_x = e.clientX - rec.x - rec.width;
          box.style.width = `${parseFloat(box.style.width, 10) + move_x}px`;
          if(e.clientY > rec.y) {
            if(e.clientY < rec.y + rec.height - MARGIN) {
              const move_y = e.clientY - rec.y;
              box.style.top = `${parseFloat(box.style.top, 10) + move_y}px`
              box.style.height = `${parseFloat(box.style.height, 10) - move_y}px`
            }
          } else {
            const move_y = rec.y - e.clientY;
            box.style.top = `${parseFloat(box.style.top, 10) - move_y}px`
            box.style.height = `${parseFloat(box.style.height, 10) + move_y}px`
          }
        } else if(onLeftEdge && onTopEdge) {
          if(e.clientY > rec.y) {
            if(e.clientY < rec.y + rec.height - MARGIN) {
              const move_y = e.clientY - rec.y;
              box.style.top = `${parseFloat(box.style.top, 10) + move_y}px`
              box.style.height = `${parseFloat(box.style.height, 10) - move_y}px`
            }
          } else {
            const move_y = rec.y - e.clientY;
            box.style.top = `${parseFloat(box.style.top, 10) - move_y}px`
            box.style.height = `${parseFloat(box.style.height, 10) + move_y}px`
          }
          if(e.clientX < rec.x) {
            const move_x = rec.x - e.clientX;
            box.style.left = `${parseFloat(box.style.left, 10) - move_x}px`
            box.style.width = `${parseFloat(box.style.width, 10) + move_x}px`
          } else {
            if(e.clientX < rec.x + rec.width - MARGIN) {
              const move_x = e.clientX - rec.x;
              box.style.left = `${parseFloat(box.style.left, 10) + move_x}px`
              box.style.width = `${parseFloat(box.style.width, 10) - move_x}px`
            }
          }
        } else if(onLeftEdge && onBottomEdge) {
          const move_y = e.clientY - rec.y - rec.height;
          box.style.height = `${parseFloat(box.style.height, 10) + move_y}px`;
          if(e.clientX < rec.x) {
            const move_x = rec.x - e.clientX;
            box.style.left = `${parseFloat(box.style.left, 10) - move_x}px`
            box.style.width = `${parseFloat(box.style.width, 10) + move_x}px`
          } else {
            if(e.clientX < rec.x + rec.width - MARGIN) {
              const move_x = e.clientX - rec.x;
              box.style.left = `${parseFloat(box.style.left, 10) + move_x}px`
              box.style.width = `${parseFloat(box.style.width, 10) - move_x}px`
            }
          }
        }
      }
    }

    handleBoxMouseUp = () => {
      if(this.state.moving && this.state.theBox) {
        this.toRelativeAndChange(this.state.theBox);
        this.setState({
          moving: false,
          theBox: null,
        })
      }
      if(this.state.resizing && this.state.theBox) {
        this.toRelativeAndChange(this.state.theBox);
        this.setState({
          resizing: false,
          theBox: null,
        })
      }
    }

    handleEdge = (e) => {
      const rec = e.target.getBoundingClientRect();
      const x_left = e.clientX - rec.x;
      const x_right = rec.x + rec.width - e.clientX;
      const y_top = e.clientY - rec.y;
      const y_bottom = rec.y + rec.height - e.clientY;
      let onLeftEdge, onRightEdge, onTopEdge, onBottomEdge;
      if(x_left <= 6) onLeftEdge = true;
      if(x_right <= 6) onRightEdge = true;
      if(y_top <= 6) onTopEdge = true;
      if(y_bottom <= 6) onBottomEdge = true;
      this.setState({
        onLeftEdge,
        onRightEdge,
        onTopEdge,
        onBottomEdge
      })
    }

    handleBoxWheel = (e) => {
      if(e.target.tagName === 'DIV') {
        if(e.target !== this.state.theBox) {
          this.setState({
            theBox: e.target
          })
        }
        e.deltaY < 0 ? this.increaseBoxSize(e.target) : this.decreaseBoxSize(e.target);
      }
    }

    shouldMoveBox = () => {
      this.setState({
        moveBox: !this.state.moveBox
      })
    }

    getCursor = () => {
      const { onLeftEdge, onTopEdge, onRightEdge, onBottomEdge } = this.state;
      if(onLeftEdge && onTopEdge || onRightEdge && onBottomEdge) {
        return 'nwse-resize';
      } else if(onRightEdge && onTopEdge || onLeftEdge && onBottomEdge) {
        return 'nesw-resize';
      } else if(onRightEdge || onLeftEdge) {
        return 'ew-resize';
      } else if(onBottomEdge || onTopEdge) {
        return 'ns-resize';
      } else {
        return 'move';
      }
    }

    drawBoxList = () => {
      return (
        this.props.boxList.map((box, index) => (
          index === this.props.boxIndex
            ? <div className="black-white-border" key={box.x_start + box.y_end}
              onMouseMove={this.state.moveBox && !this.state.moving && !this.state.resizing ? this.handleEdge : null}
              onMouseDown={this.state.moveBox ? this.handleBoxMouseDown : null}
              style={{
                userSelect: 'none',
                zIndex: 100,
                position: 'absolute',
                width: `${this.getBoxWidth(box.x_start, box.x_end)}px`,
                height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                left: `${this.getBoxX(box.x_start)}px`,
                top: `${this.getBoxY(box.y_start)}px`,
                cursor: `${this.state.moveBox ? this.getCursor() : 'crosshair'}`}}>
                  <span className="tag-title" style={{userSelect: 'none'}}><b>No.{index + 1}<br />{box.tag[0]}</b></span>
                </div>
            : <div className="black-white-border" key={box.x_start + box.y_end}
              style={{
                userSelect: 'none',
                position: 'absolute',
                width: `${this.getBoxWidth(box.x_start, box.x_end)}px`,
                height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                left: `${this.getBoxX(box.x_start)}px`,
                top: `${this.getBoxY(box.y_start)}px`,
                cursor: `${this.state.moveBox ? 'auto' : 'crosshair'}`}} />
        ))
      )
    }

    dragMDListener = (e) => {
      this.setState({
        moveOptionBox: true,
        optionBox: {
          x: e.clientX,
          y: e.clientY,
          left: this.state.optionBox.left,
          top: this.state.optionBox.top
        }
      })
    }

    dragMMListener = (e) => {
      const { optionBox, moveOptionBox } = this.state;
      if(moveOptionBox) {
        const x = e.clientX;
        const y = e.clientY;
        const left = optionBox.left + x - optionBox.x;
        const top = optionBox.top + y - optionBox.y;
        this.setState({
          optionBox: {
            x,
            y,
            left,
            top
          }
        })
      }
    }

    dragMUListener = (e) => {
      const { optionBox, moveOptionBox } = this.state;
      if(moveOptionBox) {
        const x = e.clientX - optionBox.x;
        const y = e.clientY - optionBox.y;
        const left = optionBox.left + x;
        const top = optionBox.top + y;
        this.setState({
          moveOptionBox: false,
          optionBox: {
            x: 0,
            y: 0,
            left,
            top
          }
        })
      }
    }

    addDragListener = () => {
      const optionBox = document.getElementById('option-box');
      optionBox.addEventListener('mousedown', this.dragMDListener);
      window.addEventListener('mousemove', this.dragMMListener);
      window.addEventListener('mouseup', this.dragMUListener);
    }

    removeDragListener = () => {
      const optionBox = document.getElementById('option-box');
      optionBox.removeEventListener('mousedown', this.dragMDListener);
      window.removeEventListener('mousemove', this.dragMMListener);
      window.removeEventListener('mouseup', this.dragMUListener);
    }

    render() {
      const { drawing, moveRecX, moveRecY, moveRecWidth, moveRecHeight, moveBox, optionBox } = this.state;
      const { classes } = this.props;
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1', userSelect: 'none'}}>
                <div style={{
                  width: '55px', height: '35px', background: 'white',
                  position: 'fixed', left: `${optionBox.left}px`, top: `${optionBox.top}px`,
                  borderRadius: '3px', zIndex: 1000,
                  display: 'flex', alignItems: 'center', userSelect: 'none'}}>
                  <div id="option-box" style={{width: '14px', height: '35px', position: 'absolute', left: '-7px', background: 'white', borderRadius: '3px 0px 0px 3px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(0,0,0,0.3)'}}>
                      <div className="drag-circle"/>
                      <div className="drag-circle"/>
                      <div className="drag-circle"/>
                    </div>
                  </div>
                  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div onClick={this.shouldMoveBox} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '25px', height: '25px', background: `${moveBox ? '#c1c1c1' : ''}`}}>
                      <img style={{width: '20px', height: '20px'}} src={require("./imgs/drag.svg")} />
                    </div>
                  </div>
                </div>
                <ImgTopBar
                  userName={this.props.userName}
                  taskName={this.props.taskName}
                  setImgList={this.props.setImgList}
                  boxList={this.props.boxList}
                  tagedFileCount={this.state.tagedFileCount}
                  fileCount={this.state.fileCount}
                  index={this.props.selectedImageNumInAll}
                  name={this.props.selectedImageName}
                  userLevel={this.props.userLevel}
                  deleteSameImage={this.props.deleteSameImage}
                  onDeleteImage={this.props.onDeleteImage} />
                <ImgBotBar
                  taskstatus={this.state.imgStatus} />
                <div
                  onMouseDown={moveBox ? null : this.handleMouseDown}
                  onMouseMove={moveBox ? this.handleBoxMouseMove : this.handleMouseMove}
                  onMouseUp={moveBox ? this.handleBoxMouseUp : this.handleMouseUp}
                  onContextMenu={(e) => {e.preventDefault()}}
                  onWheel={this.wheelListener}
                  id="selectedImagePanel"
                  style={{position: 'relative', width: '1200px', height: '600px', overflow: 'hidden', zIndex:'0'}}>
                    <img draggable="false" id="selectedImage" src={this.props.selectedImage} alt={this.props.selectedImage}
                      onLoad={(e) => {this.initImage(e)}}
                      style={{
                          position: 'absolute',
                          userSelect: 'none',
                          cursor: `${this.state.moveBox ? 'auto' : 'crosshair'}`,
                      }}/>
                    {this.state.imgLoaded ? this.drawBoxList() : null}
                    {drawing && <div className="black-white-border" style={{
                      position: 'absolute',
                      width: `${moveRecWidth}px`,
                      height: `${moveRecHeight}px`,
                      left: `${moveRecX}px`,
                      top: `${moveRecY}px`
                    }} />}
                </div>
                {this.props.userLevel !== 0 ?
                    <UploadImageButton
                      bindVideoFileEvent={this.props.bindVideoFileEvent}
                      defaultURL={DEFAULT_URL}
                      userName={this.props.userName}
                      taskName={this.props.taskName}
                      getImageList={this.props.getImageList}
                      bindFileEvent={this.bindFileEvent} />
                    : null}
            </div>
        )
    }
}

export default SelectedImage;
