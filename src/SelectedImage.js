import React, {Component} from 'react'
import $ from 'jquery'

class SelectedImage extends Component {
    componentDidMount() {
        const that = this
        let drawing = false
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0, x_move = 0, y_move = 0
        let rect_width = 0, rect_height = 0
        let offset = {}
        $('#selectedImage').mousedown(function(e) {
            drawing = true
            try {
                offset = $(this).offset()
                x1 = e.clientX - offset.left
                y1 = e.clientY - offset.top
                $(this).parent().append(
                    `<div id="move-rect" style="border: 2px solid black; position: absolute; left: ${x1}px; top: ${y1}px;"></div>`
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
                    const x_start_int = parseInt(x_start.slice(0, x_start.length - 2))
                    const y_start = $('#move-rect').css('top')
                    const y_start_int = parseInt(y_start.slice(0, y_start.length - 2))
                    const x_end = x_start_int + rect_width
                    const y_end = y_start_int + rect_height
                    const relative_x_start = x_start_int / img_natural_width
                    const relative_y_start = y_start_int / img_natural_height
                    const relative_x_end = x_end / img_natural_width
                    const relative_y_end = y_end / img_natural_height
                    $('#selectedImage').parent().append(
                        `<div style="width: ${rect_width}px; height: ${rect_height}px; border: 2px solid black;
                                     position: absolute; left: ${x_start}; top: ${y_start};">
                         </div>`
                     )
                     const tag = {x_start: relative_x_start, y_start: relative_y_start, x_end: relative_x_end, y_end: relative_y_end, tagString: that.props.currentTag}
                     console.log(tag)
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
    render() {
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1'}}>
                <div style={{position: 'relative'}}>
                    <img draggable="false" id="selectedImage" className="w3-image" src={this.props.selectedImage} alt={this.props.selectedImage} style={{maxHeight: '600px'}}/>
                </div>
                <form style={{position: 'absolute', bottom: '25px'}}>
                    <label htmlFor="file" className="w3-green w3-button w3-text-white">
                        <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                        OPEN IMAGES TO START
                    </label>
                    <input multiple="multiple" id="file" type="file" accept="image/*" style={{display: 'none'}}/>
                </form>
            </div>
        )
    }
}

export default SelectedImage
