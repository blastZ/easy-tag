import React, {Component} from 'react'
import CompareImage from './CompareImage.js'

class SelectedImage extends Component {
    getImageOrCanvas = () => {
        if(this.props.mode === 'GENERAL') {
            return (
                <div id="selected-image-canvas-view" style={{marginBottom: '60px'}}>
                    <img id="source" className="w3-image" src={this.props.selectedImage} alt={this.props.selectedImage} style={{display: 'none'}}/>
                    <canvas style={{maxWidth: '100%', maxHeight: '100%'}} id="canvas"></canvas>
                </div>
            )
        } else {
            return (
                <img id="selected-image-view" className="w3-image" src={this.props.selectedImage} alt={this.props.selectedImage} style={{maxHeight: '600px', maxWidth: '50%', marginLeft: '10px'}}/>
            )
        }
    }

    getMainImageView = (mode) => {
        if(mode === 'GENERAL') {
            return (
                this.getImageOrCanvas()
            )

        } else if(mode === 'FACE') {
            return (
                <div className="flex-box" style={{alignItems: 'center', justifyContent: 'center'}}>
                    <CompareImage selectedImage={this.props.compareImage}/>
                    {
                        this.getImageOrCanvas()
                    }
                </div>
            )
        }
    }

    render() {
        return (
            <div className="w3-center w3-padding-24 flex-box" style={{backgroundColor: 'black', width: '100%', flexGrow: '1', position: 'relative', justifyContent: 'center'}}>
                {this.getMainImageView(this.props.mode)}
                <form id="url-form" style={{position: 'absolute', bottom: '25px'}}>
                    <label htmlFor="file" className="w3-button w3-text-white" style={{backgroundColor: '#009cff'}}>
                        <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                        TRY YOUR OWN IMAGE OR VIDEO
                    </label>
                    <input id="file" type="file" accept="image/*" style={{display: 'none'}}/>
                </form>
            </div>
        )
    }
}

export default SelectedImage
