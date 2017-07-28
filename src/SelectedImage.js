import React, {Component} from 'react';
import ColorPanel from './ColorPanel.js';
import $ from 'jquery';

class SelectedImage extends Component {
    state = {
        fileCount: 0,
        tagedFileCount: 0
    }

    componentWillMount() {
        this.getFileCount();
        this.getTagedFileCount();
    }

    componentDidMount() {
        const that = this
        let drawing = false
        let x1 = 0, y1 = 0, x_move = 0, y_move = 0
        let rect_width = 0, rect_height = 0
        let offset = {}
        $('#selectedImage').mousedown(function(e) {
            drawing = true
            try {
                offset = $(this).offset()
                x1 = e.clientX - offset.left
                y1 = e.clientY - offset.top
                $(this).parent().append(
                    `<div id="move-rect" class="black-white-border" style="position: absolute; left: ${x1}px; top: ${y1}px;"></div>`
                )
            } catch(e) {
                alert(e)
            }
        })

        $('#selectedImage').mousemove(function(e) {
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

    deleteBox = (e) => {
        const index = $(e.currentTarget).parent().index() - 1
        this.props.onDeleteTag(index)
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
        getFileCount.open('GET', 'http://192.168.0.103:8031/api/filecount?usrname=fj&taskname=task1');
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
        getTagedFileCount.open('GET', 'http://192.168.0.103:8031/api/labeledfilecount?usrname=fj&taskname=task1');
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
                <ColorPanel/>
                <div style={{position: 'absolute', top: '0', left: '10px'}}>
                    <p className="w3-text-white">{`Progress: ${this.state.tagedFileCount}/${this.state.fileCount}`}</p>
                </div>
                <div style={{position: 'absolute', top: '0', left: '45%'}}>
                    <p className="w3-text-white">{`${this.props.selectedImageNumInAll} ${this.props.selectedImageName}`}</p>
                </div>
                <i onClick={this.props.onDeleteImage} className="fa fa-times delete-button-white" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '20px'}}></i>
                <div style={{position: 'relative'}}>
                    <img draggable="false" id="selectedImage" className="w3-image" src={this.props.selectedImage} alt={this.props.selectedImage} style={{maxHeight: '600px'}}/>
                    {
                        this.props.boxList.length > 0 ?
                        this.props.boxList.map((box) => (
                            <div className="black-white-border" key={Math.random(10000) + Math.random(10000)} style={{width: `${this.getBoxWidth(box.x_start, box.x_end)}px`, height: `${this.getBoxHeight(box.y_start, box.y_end)}px`,
                                         position: 'absolute', left: `${this.getBoxX(box.x_start)}px`, top: `${this.getBoxY(box.y_start)}px`}}>
                                         <span className="tag-title"><b>{box.tag}</b></span>
                                         <i onClick={this.deleteBox} className="fa fa-times delete-button" aria-hidden="true" style={{position: 'absolute', top: '0', right: '0'}}></i>
                            </div>
                        )) : null
                    }
                </div>
                <form style={{position: 'absolute', bottom: '25px'}}>
                    <label htmlFor="file" className="w3-green w3-button w3-text-white">
                        <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                        OPEN LOCAL IMAGES
                    </label>
                    <input multiple id="file" type="file" style={{display: 'none'}}/>
                </form>
            </div>
        )
    }
}

export default SelectedImage
