import React, {Component} from 'react';
import { connect } from 'react-redux';
import { onClickItem } from '../../actions/app_action';

class SelectBar extends Component {
    componentWillUpdate(nextProps) {
        if(nextProps.imageList.length === 1) {
            this.props.initImageCanvas(nextProps.imageList[0].url);
        }
    }

    onClickItem = (index) => {
        this.props.initImageCanvas(this.props.imageList[index].url);
        this.props.onClickItem(index);
    }

    render() {
        return (
            <ul style={{width:'100%', backgroundColor:'rgb(196, 245, 142)', paddingTop: '20px', paddingBottom: '20px'}} id="select-bar">
                {this.props.imageList.map((image, index) => (
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
    selectedImageNum: appReducer.selectedImageNum
})

const mapDispatchToProps = (dispatch) => ({
    onClickItem: (index) => dispatch(onClickItem(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBar);
