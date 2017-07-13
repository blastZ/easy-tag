import React, { Component } from 'react'
import $ from 'jquery'

class TagView extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div className="flex-box flex-column" style={{justifyContent: 'center'}}>
                <select onChange={this.props.onChangeTag} id="mySelect" className="w3-select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <button className="w3-button w3-green" onClick={this.props.onSaveResult}>SAVE</button>
            </div>
        )
    }
}

export default TagView
