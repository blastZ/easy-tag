import React, { Component } from 'react'
import $ from 'jquery'

class TagView extends Component {
    state = {
        tagStringList: ['1', '2', '3']
    }

    addTagString = () => {
        const tagString = $('#new-tag-string').val().trim()
        if(tagString) {
            this.setState((state) => {
                state.tagStringList = state.tagStringList.concat([tagString])
            })
        }
    }

    render() {
        return (
            <div className="flex-box flex-column" style={{justifyContent: 'center'}}>
                <select onChange={this.props.onChangeTagString} id="mySelect" className="w3-select">
                {
                    this.state.tagStringList.map((tagString) => (
                        <option key={tagString} value={tagString}>{tagString}</option>
                    ))
                }
                </select>
                <div className="w3-card margin-top-5 flex-box" style={{alignItems: 'center'}}>
                    <input id="new-tag-string" className="w3-input" type="text" style={{flex: '1', border: 'none'}}/>
                    <button className="w3-button w3-green" onClick={this.addTagString}>ADD TAG</button>
                </div>
                <button className="w3-button w3-green w3-card margin-top-5" onClick={this.props.onSaveResult}>SAVE</button>
            </div>
        )
    }
}

export default TagView
