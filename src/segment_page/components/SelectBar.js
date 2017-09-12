import React, {Component} from 'react';
import { connect } from 'react-redux';
import { onClickItem, getImageAnnotation, getSegmentAnnotatorLabels } from '../../actions/app_action';

let count = 0;

class SelectBar extends Component {
    componentWillUpdate(nextProps) {
        if(nextProps.imageList && nextProps.selectedImageNum === 0 && count === 0) {
            this.props.getImageAnnotation(0);
            this.props.getSegmentAnnotatorLabels();
            this.props.initImageCanvas(nextProps.imageList[0].url);
            count++;
        }
    }

    onClickItem = (index) => {
        this.props.saveSegmentAnnotator(this.props.selectedImageNum);
        this.props.getImageAnnotation(index);
        this.props.onClickItem(index);
        this.props.initImageCanvas(this.props.imageList[index].url);
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
    segmentAnnotatorList: appReducer.segmentAnnotatorList
})

const mapDispatchToProps = (dispatch) => ({
    onClickItem: (index) => dispatch(onClickItem(index)),
    getImageAnnotation: (index) => dispatch(getImageAnnotation(index)),
    getSegmentAnnotatorLabels: () => dispatch(getSegmentAnnotatorLabels())
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBar);
