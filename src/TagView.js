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

    saveTagList = () => {
        $.ajax({
            url: 'http://192.168.0.118:8888/api/v1.0/savetag',
            type: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            data: `{"taglist": ${JSON.stringify(this.state.tagStringList)}}`,
            dataType: 'text/plain',
            success: function(data) {
                console.log(data)
            },
            error: function(data) {
                console.log(data)
            }
        })
    }

    loadTagList = () => {
        const that = this
        $.ajax({
            url: 'http://192.168.0.118:8888/api/v1.0/loadtag',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if(data.taglist) {
                    that.setState({
                        tagStringList: data.taglist
                    })
                }
            },
            error: function(data) {
                window.alert('Load Failed!')
            }
        })
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
                <button onClick={this.loadTagList} className="w3-button w3-green w3-card margin-top-5">LOAD TAGLIST</button>
                <button onClick={this.saveTagList} className="w3-button w3-green w3-card margin-top-5">SAVE TAGLIST</button>
            </div>
        )
    }
}

export default TagView
