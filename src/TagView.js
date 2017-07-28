import React, { Component } from 'react'
import $ from 'jquery'

class TagView extends Component {
    state = {
        tagStringList: ['1', '2', '3'],
    }

    addTagString = () => {
        const tagString = $('#new-tag-string').val().trim()
        if(tagString) {
            this.setState((state) => {
                state.tagStringList = state.tagStringList.concat([tagString])
            })
        }
    }

    deleteCurrentTag = () => {
        const index = this.state.tagStringList.indexOf(this.props.currentTagString);
        this.setState((state) => {
            state.tagStringList.splice(index, 1);
        }, () => this.props.onChangeTagString())
    }

    saveTagList = () => {
        $.ajax({
            url: 'http://192.168.0.103:8031/api/savetag?usrname=fj&taskname=task1',
            type: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            data: `{"taglist": ${JSON.stringify(this.state.tagStringList)}}`,
            dataType: 'text/plain'
        }).done(function() {
            console.log('success');
        }).fail(function(error) {
            console.log('failed');
        })
    }

    loadTagList = () => {
        const that = this
        $.ajax({
            url: 'http://192.168.0.103:8031/api/loadtag?usrname=fj&taskname=task1',
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
                    this.state.tagStringList.map((tagString, index) => (
                        <option key={tagString} value={tagString}>{tagString}</option>
                    ))
                }
                </select>
                <button onClick={this.deleteCurrentTag} className="w3-card w3-button w3-green margin-top-5">DELETE CURRENT TAG</button>
                <div className="w3-card margin-top-5 flex-box" style={{alignItems: 'center'}}>
                    <input id="new-tag-string" className="w3-input" type="text" style={{flex: '1', border: 'none'}}/>
                    <button className="w3-button w3-green" onClick={this.addTagString}>ADD TAG</button>
                </div>
                <button onClick={this.loadTagList} className="w3-button w3-green w3-card margin-top-5">LOAD TAGLIST</button>
                <button onClick={this.saveTagList} className="w3-button w3-green w3-card margin-top-5">SAVE TAGLIST</button>
                <div className="flex-box margin-top-5 w3-card">
                    <span className="w3-green flex-box" style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>INFO:</span>
                    <input onChange={this.props.onHandleInfoChange} className="w3-input" type="text" value={this.props.info} style={{width: '70%'}}/>
                </div>
                <div style={{position: 'absolute', bottom: '0'}}>
                    <div className="flex-box margin-top-5 w3-card">
                        <input onChange={this.props.onHandleStartChange} className="w3-input" type="number" value={this.props.start} style={{width: '35%'}}/>
                        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                        <input onChange={this.props.onHandleNumChange} className="w3-input" type="number" value={this.props.num} style={{width: '35%'}}/>
                        <button onClick={this.props.onGetImageList} className="w3-button w3-green" style={{width: '30%'}}>GET</button>
                    </div>
                    <button onClick={this.props.onNextImageList} className="w3-button w3-card w3-green margin-top-5 full-width">NEXT</button>
                    <button onClick={this.props.onPreviousImageList} className="w3-button w3-card w3-green margin-top-5 full-width">PREVIOUS</button>
                </div>
            </div>
        )
    }
}

export default TagView
