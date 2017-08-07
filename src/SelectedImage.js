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

    componentDidMount() {
        this.setState({imgLoaded: true});
        const that = this;
        //bind upload and show events
        $('#file').on('change', function() {
            console.log('hey');
            const files = this.files;
            //let loadCount = 0; --------maybe use loadCount to setState per 50 times
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
        })
        let drawing = false
        let x1 = 0, y1 = 0, x_move = 0, y_move = 0
        let rect_width = 0, rect_height = 0
        let offset = {}
        $('#selectedImagePanel').mousedown(function(e) {
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
        })

        $('#selectedImagePanel').mousemove(function(e) {
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
        })

        $(document).mouseup(function(e) {
            if(drawing) {
                const img_natural_width = $('#selectedImage')[0].width
                const img_natural_height = $('#selectedImage')[0].height
                try {
                    const x_start = $('#move-rect').css('left')
                    const x_start_int = parseInt(x_start.slice(0, x_start.length - 2), 10) //remove 'px'
                    const y_start = $('#move-rect').css('top')
                    const y_start_int = parseInt(y_start.slice(0, y_start.length - 2), 10)
                    const x_end = x_start_int + rect_width
                    const y_end = y_start_int + rect_height
                    const relative_x_start = (x_start_int / img_natural_width).toFixed(3)
                    const relative_y_start = (y_start_int / img_natural_height).toFixed(3)
                    const relative_x_end = (x_end / img_natural_width).toFixed(3)
                    const relative_y_end = (y_end / img_natural_height).toFixed(3)
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
        })
    }

    getBoxX = (r_x_start) => {
        const img_natural_width = $('#selectedImage')[0].width;
        return (img_natural_width * r_x_start);
    }

    getBoxY = (r_y_start) => {
        const img_natural_height = $('#selectedImage')[0].height;
        return (img_natural_height * r_y_start);
    }

    getBoxWidth = (r_x_start, r_x_end) => {
        const img_natural_width = $('#selectedImage')[0].width;
        const x_start = img_natural_width * r_x_start;
        const x_end = img_natural_width * r_x_end;
        return (x_end - x_start);
    }

    getBoxHeight = (r_y_start, r_y_end) => {
        const img_natural_height = $('#selectedImage')[0].height;
        const y_start = img_natural_height * r_y_start;
        const y_end = img_natural_height * r_y_end;
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
                <i onClick={this.props.onDeleteImage} className="fa fa-times delete-button-white" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '20px'}}></i>
                <div id="selectedImagePanel" style={{position: 'relative'}}>
                    <img draggable="false" id="selectedImage" className="w3-image" src={this.props.selectedImage} alt={this.props.selectedImage} style={{maxHeight: '600px'}}/>
                    {
                        this.state.imgLoaded ? this.drawBoxList() : null
                    }
                </div>
                <form style={{position: 'absolute', bottom: '25px'}}>
                    <label htmlFor="file" className="w3-green w3-button w3-text-white">
                        <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                        上 传 本 地 图 片
                    </label>
                    <input multiple id="file" type="file" style={{display: 'none'}}/>
                </form>
            </div>
        )
    }
}

export default SelectedImage
