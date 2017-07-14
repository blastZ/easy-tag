import React, {Component} from 'react'

class SelectBar extends Component {
    render() {
        return (
            <ul style={{width:'100%', backgroundColor:'rgb(196, 245, 142)', paddingTop: '20px', paddingBottom: '20px'}} id="select-bar">
                {this.props.imageList.map((image, index) => (
                    index !== this.props.selectedImageNum ?
                    <BarItem key={image.url.toString()} onClickItem={this.props.onClickItem} dataKey={image.url.toString()} imageURL={image.url}/> :
                    <SelectedBarItem key={image.url.toString()} onClickItem={this.props.onClickItem} dataKey={image.url.toString()} imageURL={image.url}/>
                ))}
            </ul>
        )
    }
}

class BarItem extends Component {
    render() {
        return (
            <li onClick={() => this.props.onClickItem(this.props.dataKey)} className="small-image w3-image" style={{backgroundImage: `url(${this.props.imageURL})`}}/>
        )
    }
}

class SelectedBarItem extends Component {
    render() {
        return (
            <li onClick={() => this.props.onClickItem(this.props.dataKey)} className="small-image w3-image select-bar-item-selected" style={{backgroundImage: `url(${this.props.imageURL})`}}/>
        )
    }
}

export default SelectBar
