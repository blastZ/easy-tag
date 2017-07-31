import React, { Component } from 'react'
import $ from 'jquery'

class TagView extends Component {
    state = {
        tagStringList: ['1', '2', '3'],
    }

    componentDidMount() {
        this.loadTagList();
    }

    addTagString = () => {
        const tagString = $('#new-tag-string').val().trim()
        if(tagString) {
            $('#new-tag-string').val('');
            this.setState((state) => {
                state.tagStringList = state.tagStringList.concat([tagString])
            })
        }
    }

    deleteCurrentTag = () => {
        const result = window.confirm('确定删除当前标签吗?');
        if(result) {
            const index = this.state.tagStringList.indexOf(this.props.currentTagString);
            this.setState((state) => {
                state.tagStringList.splice(index, 1);
            }, () => this.props.onChangeTagString())
        }
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
                console.log('getTagList success')
                if(data.taglist) {
                    that.setState({
                        tagStringList: data.taglist
                    }, function() {
                        that.props.onChangeTagString();
                    })
                }
            },
            error: function(data) {
                console.log('getTagList failed');
            }
        })
    }

    onDeleteBox = (index) => {
        this.props.onDeleteBox(index);
    }

    onChangeBoxInfo(index, e) {
        this.props.onChangeBoxInfo(index, e.target.value);
    }

    render() {
        return (
            <div className="flex-box flex-column" style={{justifyContent: 'center', height: '100%'}}>
                <select onChange={this.props.onChangeTagString} id="mySelect" className="w3-select">
                {
                    this.state.tagStringList.map((tagString, index) => (
                        <option key={tagString} value={tagString}>{tagString}</option>
                    ))
                }
                </select>
                <button onClick={this.deleteCurrentTag} className="w3-card w3-button w3-green margin-top-5">删除当前标签</button>
                <div className="w3-card margin-top-5 flex-box" style={{alignItems: 'center'}}>
                    <input id="new-tag-string" className="w3-input" type="text" style={{flex: '1', border: 'none'}}/>
                    <button className="w3-button w3-green" onClick={this.addTagString}>添加标签</button>
                </div>
                <button onClick={this.saveTagList} className="w3-button w3-green w3-card margin-top-5">保存标签列表</button>
                <ul className="w3-ul w3-hoverable margin-top-5"  style={{overflowY: 'auto', flex: '1'}}>{
                    this.props.boxList.map((box, index) => (
                        <li className="w3-hover-green" key={box.x_start + box.y_end}>
                            <span>序号:{index + 1}  标签:{box.tag}</span>
                            <i onClick={this.onDeleteBox.bind(this, index)} className="fa fa-times delete-button w3-right" aria-hidden="true"></i>
                            <div>额外信息:<input type="text" onChange={this.onChangeBoxInfo.bind(this, index)} value={this.props.boxList[index].info}/></div>
                        </li>
                    ))
                }</ul>
                <div>
                    <div className="flex-box margin-top-5 w3-card">
                        <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                        <input onChange={this.props.onHandleStartChange} className="w3-input" type="number" value={this.props.start} style={{width: '30%'}}/>
                        <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>每页<br/>数量</span>
                        <input onChange={this.props.onHandleNumChange} className="w3-input" type="number" value={this.props.num} style={{width: '30%'}}/>
                        <button onClick={this.props.onGetImageList} className="w3-button w3-green" style={{width: '30%'}}>确定</button>
                    </div>
                    <div className="flex-box margin-top-5 w3-card">
                        <button style={{width: '50%'}} onClick={this.props.onPreviousImageList} className="w3-button w3-green">上一页</button>
                        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                        <button style={{width: '50%'}} onClick={this.props.onNextImageList} className="w3-button w3-green">下一页</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TagView
