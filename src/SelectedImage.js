import React, {Component} from 'react';
import $ from 'jquery';
import UploadImageButton from './UploadImageButton';
import ImgTopBar from './ImgTopBar';
import { DEFAULT_TAG_SIZE } from './utils/global_config';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

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
        resizeBox: false,
        resizeDirec: '',
        movePoint: {x: 0, y: 0},
        theBox: null
    }

    componentWillMount() {
        this.getFileCount();
        this.getTagedFileCount();
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.deleteImageListener);
        document.removeEventListener('keyup', this.nextPreviousImageListener);
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
        const tag = {x_start: relative_x_start, y_start: relative_y_start, x_end: relative_x_end, y_end: relative_y_end, tag: [this.props.currentTagString], info: this.props.info ? this.props.info : '', tagger: this.props.userName}
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

    getFileCount = () => {
        const that = this;
        const getFileCount = new XMLHttpRequest();
        getFileCount.open('GET', `${this.props.defaultURL}filecount?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
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
        getTagedFileCount.open('GET', `${this.props.defaultURL}labeledfilecount?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
        getTagedFileCount.send();
        getTagedFileCount.onload = function() {
            console.log('getTagedFileCount success.');
            const theTagedFileCount = getTagedFileCount.response;
            that.setState({tagedFileCount: theTagedFileCount});
        }
    }

    toRelativeAndChange = (box) => {
      const image = document.getElementById('selectedImage');
      const imgLeft = parseFloat(image.style.left, 10);
      const left = parseFloat(box.style.left, 10);
      const imgTop = parseFloat(image.style.top, 10);
      const top = parseFloat(box.style.top, 10);
      const imgWidth = parseFloat(image.width, 10);
      const width = parseFloat(box.style.width, 10);
      const imgHeight = parseFloat(image.height, 10);
      const height = parseFloat(box.style.height, 10);
      const imgRight = imgLeft + imgWidth;
      const right = left + width;
      const imgBottom = imgBottom + imgHeight;
      const bottom = top + height;
      const x_start = ((left - imgLeft) / imgWidth).toFixed(3);
      const y_start = ((top - imgTop) / imgHeight).toFixed(3);
      const x_end = ((right - imgLeft) / imgWidth).toFixed(3);
      const y_end = ((bottom - imgTop) / imgHeight).toFixed(3);
      this.props.changeBox(this.props.boxIndex, x_start, y_start, x_end, y_end);
    }

    handleBoxMouseDown = (e) => {
      if(e.target.tagName === 'DIV') {
        this.setState({
          moving: true,
          movePoint: {x: e.clientX, y: e.clientY},
          theBox: e.target
        })
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
    }

    handleBoxMouseUp = () => {
      if(this.state.moving && this.state.theBox) {
        this.toRelativeAndChange(this.state.theBox);
        this.setState({
          moving: false,
          theBox: null,
        })
      }
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

    increaseBoxSize = (box) => {
      const { resizeDirec } = this.state;
      if(resizeDirec === 'BOTH') {
        box.style.left = `${parseFloat(box.style.left, 10) - 0.5}px`;
        box.style.top = `${parseFloat(box.style.top, 10) - 0.5}px`;
        box.style.width = `${parseFloat(box.style.width, 10) + 1}px`;
        box.style.height = `${parseFloat(box.style.height, 10) + 1}px`;
      } else if(resizeDirec === 'HORIZONTAL') {
        box.style.left = `${parseFloat(box.style.left, 10) - 0.5}px`;
        box.style.width = `${parseFloat(box.style.width, 10) + 1}px`;
      } else if(resizeDirec === 'VERTICAL') {
        box.style.top = `${parseFloat(box.style.top, 10) - 0.5}px`;
        box.style.height = `${parseFloat(box.style.height, 10) + 1}px`;
      }
    }

    decreaseBoxSize = (box) => {
      const { resizeDirec } = this.state;
      if(resizeDirec === 'BOTH') {
        box.style.left = `${parseFloat(box.style.left, 10) + 0.5}px`;
        box.style.top = `${parseFloat(box.style.top, 10) + 0.5}px`;
        box.style.width = `${parseFloat(box.style.width, 10) - 1}px`;
        box.style.height = `${parseFloat(box.style.height, 10) - 1}px`;
      } else if(resizeDirec === 'HORIZONTAL') {
        box.style.left = `${parseFloat(box.style.left, 10) + 0.5}px`;
        box.style.width = `${parseFloat(box.style.width, 10) - 1}px`;
      } else if(resizeDirec === 'VERTICAL') {
        box.style.top = `${parseFloat(box.style.top, 10) + 0.5}px`;
        box.style.height = `${parseFloat(box.style.height, 10) - 1}px`;
      }
    }

    shouldMoveBox = () => {
      this.setState({
        moveBox: !this.state.moveBox
      })
    }

    shouldResizeBox = (direc) => {
      if(this.state.resizeDirec === direc) {
        if(this.state.theBox) this.toRelativeAndChange(this.state.theBox);
        this.setState({
          theBox: null,
          resizeBox: false,
          resizeDirec: '',
        })
      } else {
        this.setState({
          resizeBox: true,
          resizeDirec: direc,
        })
      }
    }

    drawBoxList = () => {
      return (
        this.props.boxList.map((box, index) => (
          index === this.props.boxIndex
            ? <div className="black-white-border" key={box.x_start + box.y_end}
              onMouseDown={this.state.moveBox ? this.handleBoxMouseDown : null}
              onWheel={this.state.resizeBox ? this.handleBoxWheel : null}
              style={{
                zIndex: 100,
                position: 'absolute',
                width: `${this.getBoxWidth(box.x_start, box.x_end)}px`,
                height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                left: `${this.getBoxX(box.x_start)}px`,
                top: `${this.getBoxY(box.y_start)}px`,
                cursor: `${this.state.moveBox ? 'move' : 'crosshair'}`}}>
                  <span className="tag-title" style={{userSelect: 'none'}}><b>No.{index + 1}<br />{box.tag[0]}</b></span>
                </div>
            : <div className="black-white-border" key={box.x_start + box.y_end}
              style={{
                position: 'absolute',
                width: `${this.getBoxWidth(box.x_start, box.x_end)}px`,
                height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                left: `${this.getBoxX(box.x_start)}px`,
                top: `${this.getBoxY(box.y_start)}px`,
                cursor: `${this.state.moveBox ? 'auto' : 'crosshair'}`}} />
        ))
      )
    }

    render() {
      const { drawing, moveRecX, moveRecY, moveRecWidth, moveRecHeight, moveBox, resizeBox, resizeDirec } = this.state;
      const { classes } = this.props;
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1'}}>
                <div style={{width: '35px', height: '188px', background: 'white', position: 'fixed', left: '40px', top: '170px', borderRadius: '5px', zIndex: 1000}}>
                  <List>
                    <ListItem onClick={this.shouldMoveBox} button style={{padding: '10px 8px', background: `${moveBox ? '#c1c1c1' : ''}`}}>
                      <ListItemIcon>
                        <img style={{width: '20px', height: '20px'}} src={require("./imgs/drag.svg")} />
                      </ListItemIcon>
                    </ListItem>
                    <ListItem onClick={() => this.shouldResizeBox('BOTH')} button style={{padding: '10px 8px', marginTop: '10px', background: `${(resizeBox && resizeDirec === 'BOTH') ? '#c1c1c1' : ''}`}}>
                      <ListItemIcon>
                        <img style={{width: '20px', height: '20px'}} src={require("./imgs/resize.svg")} />
                      </ListItemIcon>
                    </ListItem>
                    <ListItem onClick={() => this.shouldResizeBox('HORIZONTAL')} button style={{padding: '10px 8px', marginTop: '10px', background: `${(resizeBox && resizeDirec === 'HORIZONTAL') ? '#c1c1c1' : ''}`}}>
                      <ListItemIcon>
                        <img style={{width: '20px', height: '20px'}} src={require("./imgs/resize_horizontal.svg")} />
                      </ListItemIcon>
                    </ListItem>
                    <ListItem onClick={() => this.shouldResizeBox('VERTICAL')} button style={{padding: '10px 8px', marginTop: '10px', background: `${(resizeBox && resizeDirec === 'VERTICAL') ? '#c1c1c1' : ''}`}}>
                      <ListItemIcon>
                        <img style={{width: '20px', height: '20px'}} src={require("./imgs/resize_vertical.svg")} />
                      </ListItemIcon>
                    </ListItem>
                  </List>
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
                <div
                  onMouseDown={moveBox ? null : this.handleMouseDown}
                  onMouseMove={moveBox ? this.handleBoxMouseMove : this.handleMouseMove}
                  onMouseUp={moveBox ? this.handleBoxMouseUp : this.handleMouseUp}
                  onContextMenu={(e) => {e.preventDefault()}}
                  onWheel={resizeBox ? null : this.wheelListener}
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
                      defaultURL={this.props.defaultURL}
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
