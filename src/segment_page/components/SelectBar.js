import React, {Component} from 'react';
import { connect } from 'react-redux';
import { onClickItem, getImageAnnotation, shouldUpdateImage} from '../../actions/app_action';

let count = 0;

class SelectBar extends Component {
    componentWillUnmount() {
        count = 0;
    }

    componentWillUpdate(nextProps) {
        if(nextProps.imageList && nextProps.imageList.length > 0 && nextProps.selectedImageNum === 0 && count === 0) {
            this.props.getImageAnnotation(0);
            this.props.initImageCanvas(nextProps.imageList[0].url);
            count++;
        }
    }

    componentDidUpdate() {
        if(this.props.updateImage) {
            this.props.getImageAnnotation(this.props.selectedImageNum);
            this.props.initImageCanvas(this.props.imageList[this.props.selectedImageNum].url);
            this.props.shouldUpdateImage();
        }
    }

    onClickItem = (index) => {
        this.props.saveSegmentAnnotator(this.props.selectedImageNum);
        this.props.getImageAnnotation(index);
        this.props.onClickItem(index);
        setTimeout(() => {
          this.props.onSetRegionSize(index)
        }, 100);
    }

    render() {
        return (
            <ul style={{width:'100%', backgroundColor:'rgb(196, 245, 142)', paddingTop: '20px', paddingBottom: '20px'}} id="select-bar">
                {this.props.imageList && this.props.imageList.map((image, index) => (
                    index !== this.props.selectedImageNum ?
                    <BarItem labeled={image.labeled} key={image.url.toString() + index.toString()} onClickItem={this.onClickItem.bind(this, index)} dataKey={image.url.toString()} imageURL={image.url}/> :
                    <SelectedBarItem labeled={image.labeled} key={image.url.toString() + index.toString()} onClickItem={this.onClickItem.bind(this, index)} dataKey={image.url.toString()} imageURL={image.url}/>
                ))}
            </ul>
        )
    }
}

class BarItem extends Component {
    render() {
        return (
            <li onClick={this.props.onClickItem} className="small-image w3-image" style={{position: 'relative', backgroundImage: `url(${this.props.imageURL})`}}>{
                this.props.labeled === 1 ? <i className="fa fa-check-circle-o taged-image" aria-hidden="true"></i> : null
            }</li>
        )
    }
}

class SelectedBarItem extends Component {
    render() {
        return (
            <li onClick={this.props.onClickItem} className="small-image w3-image select-bar-item-selected" style={{position: 'relative', backgroundImage: `url(${this.props.imageURL})`}}>{
                this.props.labeled === 1 ? <i className="fa fa-check-circle-o taged-image" aria-hidden="true"></i> : null
            }</li>
        )
    }
}

const mapStateToProps = ({ appReducer }) => ({
    imageList: appReducer.imageList,
    selectedImageNum: appReducer.selectedImageNum,
    segmentAnnotatorList: appReducer.segmentAnnotatorList,
    updateImage: appReducer.updateImage
})

const mapDispatchToProps = (dispatch) => ({
    onClickItem: (index) => dispatch(onClickItem(index)),
    getImageAnnotation: (index) => dispatch(getImageAnnotation(index)),
    shouldUpdateImage: () => dispatch(shouldUpdateImage())
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBar);
