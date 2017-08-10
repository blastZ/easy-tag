import React, {Component} from 'react';
import $ from 'jquery';

class SelectedImage extends Component {
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
            container.width = 1000;
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
        $('#file').on('change', function() {
            const files = this.files;
            let result = true;
            for(const file of files) {
                if((/^[a-zA-Z0-9\-\_\.]+$/).test(file.name) === false) {
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

        let drawing = false
        let x1 = 0, y1 = 0, x_move = 0, y_move = 0
        let rect_width = 0, rect_height = 0
        let offset = {}
        let start = false;
        let previousClientX = 0, previousClientY = 0, currentClientX = 0, currentClientY = 0;
        $('#selectedImagePanel').mousedown(function(e) {
            if(e.which === 1) {
                drawing = true
                try {
                    offset = $(this).offset()
                    x1 = e.clientX - offset.left
                    y1 = e.clientY - offset.top
                    $(this).append(
                        `<div id="move-rect" class="black-white-border" style="position: absolute; left: ${x1}px; top: ${y1}px;"></div>`
                    )
                } catch(e) {
                    alert(e)
                }
            } else if(e.which === 3) {
                start = true;
                previousClientX = e.clientX;
                previousClientY = e.clientY;
            }
        })

        $('#selectedImagePanel').mousemove(function(e) {
            if(e.which === 1) {
                if(drawing) {
                    x_move = e.clientX - offset.left
                    y_move = e.clientY - offset.top
                    if(x_move > x1 && y_move < y1) {
                        $('#move-rect').css('left', `${x1}px`)
                        $('#move-rect').css('top', `${y_move}px`)
                    } else if(x_move > x1 && y_move > y1) {
                        $('#move-rect').css('left', `${x1}px`)
                        $('#move-rect').css('top', `${y1}px`)
                    } else if(x_move < x1 && y_move > y1) {
                        $('#move-rect').css('left', `${x_move}px`)
                        $('#move-rect').css('top', `${y1}px`)
                    } else if(x_move < x1 && y_move < y1) {
                        $('#move-rect').css('left', `${x_move}px`)
                        $('#move-rect').css('top', `${y_move}px`)
                    }
                    rect_width = Math.abs(x_move - x1)
                    rect_height = Math.abs(y_move - y1)
                    $('#move-rect').css('width', `${rect_width}px`)
                    $('#move-rect').css('height', `${rect_height}px`)
                }
            } else if(e.which === 3) {
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

        $(document).mouseup(function(e) {
            if(e.which === 1) {
                if(drawing) {
                    const img_natural_width = document.getElementById('selectedImage').width;
                    const img_natural_height = document.getElementById('selectedImage').height;
                    try {
                        const theImage_left = parseInt(theImage.style.left);
                        const theImage_top = parseInt(theImage.style.top);
                        const x_start = $('#move-rect').css('left');
                        const x_start_int = parseInt(x_start);
                        const y_start = $('#move-rect').css('top');
                        const y_start_int = parseInt(y_start);
                        const x_end = x_start_int + rect_width
                        const y_end = y_start_int + rect_height
                        const relative_x_start = ((x_start_int - theImage_left) / img_natural_width).toFixed(3)
                        const relative_y_start = ((y_start_int - theImage_top) / img_natural_height).toFixed(3)
                        const relative_x_end = ((x_end - theImage_left) / img_natural_width).toFixed(3)
                        const relative_y_end = ((y_end - theImage_top) / img_natural_height).toFixed(3)
                        const tag = {x_start: relative_x_start, y_start: relative_y_start, x_end: relative_x_end, y_end: relative_y_end, tag: that.props.currentTagString, info: that.props.info}
                        //console.log(tag)
                        that.props.onAddTag(tag)
                        $('#move-rect').remove()
                    } catch(e) {
                        alert(e)
                    }
                }
                drawing = false
                rect_width = 0
                rect_height = 0
            } else if(e.which === 3) {
                start = false;
                that.forceUpdate();
            }
        })

        container.addEventListener('wheel', function(e) {
            e.wheelDeltaY > 0 ? that.increaseImageSize() : that.decreaseImageSize();
            that.forceUpdate();
        });
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

    drawBoxList = () => {
        return (
            this.props.boxList.length > 0 ?
            this.props.boxList.map((box, index) => (
                <div className="black-white-border" key={box.x_start + box.y_end} style={{width: `${this.getBoxWidth(box.x_start, box.x_end)}px`, height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                             position: 'absolute', left: `${this.getBoxX(box.x_start)}px`, top: `${this.getBoxY(box.y_start)}px`}}>
                             <span className="tag-title"><b>No.{index + 1}<br/>{box.tag}</b></span>
                </div>
            )) : null
        );
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
                    <i onClick={this.props.onDeleteImage} className="fa fa-times delete-button-white" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '20px'}}></i>
                    : null
                }
                <div id="selectedImagePanel" style={{position: 'relative', width: '1000px', height: '600px', overflow: 'hidden'}}>
                    <img draggable="false" id="selectedImage" src={this.props.selectedImage} alt={this.props.selectedImage} style={{position: 'absolute'}}/>
                    {
                        this.state.imgLoaded ? this.drawBoxList() : null
                    }
                </div>
                {
                    this.props.userLevel !== 0 ?
                    <form style={{position: 'absolute', bottom: '25px'}}>
                        <label htmlFor="file" className="w3-green w3-button w3-text-white">
                            <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                            上 传 本 地 图 片
                        </label>
                        <input multiple id="file" type="file" style={{display: 'none'}}/>
                    </form>
                    : null
                }
            </div>
        )
    }
}

export default SelectedImage
