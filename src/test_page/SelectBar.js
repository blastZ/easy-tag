import React, {Component} from 'react'

class SelectBar extends Component {

    render() {
        return (
            <ul style={{width:'100%', backgroundColor:'rgb(196, 245, 142)', paddingTop: '20px', paddingBottom: '20px', zIndex: '10'}} id="select-bar">
                {this.props.imageList.map((image, index) => (
                    index !== this.props.selectedImageNum ?
                    <BarItem labeled={image.labeled} key={image.url.toString() + index.toString()} onClickItem={this.props.onClickItem} dataKey={image.url.toString()} imageURL={image.url}/> :
                    <SelectedBarItem labeled={image.labeled} key={image.url.toString() + index.toString()} onClickItem={this.props.onClickItem} dataKey={image.url.toString()} imageURL={image.url}/>
                ))}
            </ul>
        )
    }
}

class BarItem extends Component {
    render() {
        return (
            <li onClick={() => this.props.onClickItem(this.props.dataKey)} className="small-image w3-image" style={{position: 'relative', backgroundImage: `url(${this.props.imageURL})`}}>{
                this.props.labeled === 1 ? <i className="fa fa-check-circle-o taged-image" aria-hidden="true"></i> : null
            }</li>
        )
    }
}

class SelectedBarItem extends Component {
    render() {
        return (
            <li onClick={() => this.props.onClickItem(this.props.dataKey)} className="small-image w3-image select-bar-item-selected" style={{position: 'relative', backgroundImage: `url(${this.props.imageURL})`}}>{
                this.props.labeled === 1 ? <i className="fa fa-check-circle-o taged-image" aria-hidden="true"></i> : null
            }</li>
        )
    }
}

export default SelectBar
