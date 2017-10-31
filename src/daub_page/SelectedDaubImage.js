import React, {Component} from 'react';
import $ from 'jquery';

var mouseupListener;

class SelectedDaubImage extends Component {
    state = {
        fileCount: 0,
        tagedFileCount: 0,
        imgLoaded: false
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
        const canvas = document.getElementById('selectedCanvas');
        const ctx = canvas.getContext('2d');

        if(theImage.naturalHeight > 600) {
            theImage.height = 600;
            canvas.height = 600;
            canvas.width = theImage.width;
        } else {
            theImage.height = theImage.naturalHeight;
            canvas.height = theImage.height;
            canvas.width = theImage.width;
        }
        theImage.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
        theImage.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
        canvas.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
        canvas.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
    }

    componentDidMount() {
        const that = this;
        const theImage = document.getElementById('selectedImage');
        const container = document.getElementById('selectedImagePanel');
        const canvas = document.getElementById('selectedCanvas');
        const ctx = canvas.getContext('2d');

        container.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        theImage.onload = function() {
            const container = document.getElementById('selectedImagePanel');
            container.width = 1200;
            container.height = 600;
            canvas.width = theImage.width;
            canvas.height = theImage.height;
            if(theImage.height > 600) {
                theImage.height = 600;
                canvas.height = 600;
                canvas.width = theImage.width;
            }
            theImage.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
            theImage.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
            canvas.style.left = container.width - theImage.width > 0 ? ((container.width - theImage.width) / 2).toString() + 'px' : '0px';
            canvas.style.top = container.height - theImage.height > 0 ? ((container.height - theImage.height) / 2).toString() + 'px' : '0px';
            that.setState({imgLoaded: true});
        }

        document.addEventListener('keyup', this.deleteImageListener);
        document.addEventListener('keyup', this.nextPreviousImageListener);

        //bind upload and show events
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

        let drawing = false;
        let currentX, currentY, previousX, previousY;
        let start = false;
        let previousClientX = 0, previousClientY = 0, currentClientX = 0, currentClientY = 0;
        canvas.addEventListener('mousedown', (e) => {
          if(e.which === 1) {
            drawing = true;
            currentX = e.clientX - canvas.offsetLeft - container.offsetLeft;
            currentY = e.clientY - canvas.offsetTop - container.offsetTop;
            let dot_flag = true;
            if(dot_flag) {
              ctx.beginPath();
              ctx.fillStyle = that.props.getColor();
              ctx.fillRect(currentX, currentY, 4, 4);
              ctx.closePath();
              dot_flag = false;
            }
          }
        });
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
                    theImage.style.left = (parseInt(canvas.style.left) + currentClientX - previousClientX).toString() + 'px';
                    theImage.style.top = (parseInt(canvas.style.top) + currentClientY - previousClientY).toString() + 'px';
                    canvas.style.left = (parseInt(canvas.style.left) + currentClientX - previousClientX).toString() + 'px';
                    canvas.style.top = (parseInt(canvas.style.top) + currentClientY - previousClientY).toString() + 'px';
                    previousClientX = e.clientX;
                    previousClientY = e.clientY;
                    that.forceUpdate();
              }
            }
        })

        canvas.addEventListener('mousemove', (e) => {
          if(e.which === 1) {
            if(drawing) {
              previousX = currentX;
              previousY = currentY;
              currentX = e.clientX - canvas.offsetLeft - container.offsetLeft;
              currentY = e.clientY - canvas.offsetTop - container.offsetTop;
              ctx.beginPath();
              ctx.moveTo(previousX, previousY);
              ctx.lineTo(currentX, currentY);
              ctx.strokeStyle = that.props.getColor();
              ctx.lineWidth = 4;
              ctx.stroke();
              ctx.closePath();
            }
          }
        });

        mouseupListener = function(e) {
          if(e.which === 1) {
            drawing = false;
          } else if(e.which === 3) {
              start = false;
              that.forceUpdate();
          }
        }
        document.addEventListener('mouseup', mouseupListener);
        container.addEventListener('wheel', this.wheelListener);
    }

    wheelListener = (e) => {
      e.wheelDeltaY > 0 ? this.increaseImageSize() : this.decreaseImageSize();
    }

    increaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        const canvas = document.getElementById('selectedCanvas');
        const ctx  = canvas.getContext('2d');
        const url = canvas.toDataURL();
        theImage.height += 10;
        theImage.style.left = (parseInt(canvas.style.left) - 5).toString() + 'px';
        theImage.style.top = (parseInt(canvas.style.top) - 5).toString() + 'px';
        canvas.style.left = (parseInt(canvas.style.left) - 5).toString() + 'px';
        canvas.style.top = (parseInt(canvas.style.top) - 5).toString() + 'px';
        canvas.height = theImage.height;
        canvas.width = theImage.width;
        const newImage = new Image();
        newImage.onload = () => {
          ctx.drawImage(newImage, 0, 0, theImage.width, theImage.height);
        }
        newImage.src = url;
    }

    decreaseImageSize = () => {
        const theImage = document.getElementById('selectedImage');
        const canvas = document.getElementById('selectedCanvas');
        const ctx  = canvas.getContext('2d');
        const url = canvas.toDataURL();
        theImage.height -= 10;
        theImage.style.left = (parseInt(canvas.style.left) + 5).toString() + 'px';
        theImage.style.top = (parseInt(canvas.style.top) + 5).toString() + 'px';
        canvas.style.left = (parseInt(canvas.style.left) + 5).toString() + 'px';
        canvas.style.top = (parseInt(canvas.style.top) + 5).toString() + 'px';
        canvas.height = theImage.height;
        canvas.width = theImage.width;
        const newImage = new Image();
        newImage.onload = () => {
          ctx.drawImage(newImage, 0, 0, theImage.width, theImage.height);
        }
        newImage.src = url;
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

    render() {
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1'}}>
                <div style={{position: 'absolute', top: '0', left: '10px'}}>
                    <p className="w3-text-white">{`标注进度: ${this.state.tagedFileCount}/${this.state.fileCount}`}</p>
                </div>
                <div style={{position: 'absolute', top: '0', left: '45%'}}>
                    <p className="w3-text-white">{`第 ${this.props.selectedImageNumInAll} 张 图片名称: ${this.props.selectedImageName}`}</p>
                </div>
                {
                    this.props.userLevel !== 0 ?
                    <i onClick={this.props.onDeleteImage} className="fa fa-times delete-button-white" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '20px', zIndex: '100'}}></i>
                    : null
                }
                <div id="selectedImagePanel" style={{position: 'relative', width: '1200px', height: '600px', overflow: 'hidden'}}>
                    <img draggable="false" id="selectedImage" src={this.props.selectedImage} alt={this.props.selectedImage} style={{position: 'absolute'}}/>
                    <canvas draggable="false" id="selectedCanvas" style={{position: 'absolute'}} />
                </div>
                {
                    // this.props.userLevel !== 0 ?
                    <form style={{position: 'absolute', bottom: '25px'}}>
                        <label htmlFor="file" className="w3-green w3-button w3-text-white">
                            <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                            上 传 本 地 图 片
                        </label>
                        <input multiple id="file" type="file" style={{display: 'none'}}/>
                    </form>
                    // : null
                }
            </div>
        )
    }
}

export default SelectedDaubImage
