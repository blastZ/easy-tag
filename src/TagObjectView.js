import React, { Component } from 'react'
import $ from 'jquery'

class TagObjectView extends Component {
    state = {
        tagStringList: ['1', '2', '3'],
        currentTagString: ''
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.pageUpAndDownListener);
    }

    componentDidMount() {
        const that = this;
        this.loadTagList();
        document.addEventListener('keyup', this.pageUpAndDownListener);
    }

    componentDidUpdate() {
    }

    pageUpAndDownListener = (e) => {
        if(e.keyCode === 33) {
            this.props.onPreviousImageList();
        } else if(e.keyCode === 34) {
            this.props.onNextImageList();
        }
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
            if(this.state.tagStringList.length === 1) {
                window.alert('不能删除最后一个标签');
            }else {
                const index = this.state.tagStringList.indexOf(this.props.currentTagString);
                this.setState((state) => {
                    state.tagStringList.splice(index, 1);
                }, () => this.props.onChangeTagString())
            }
        }
    }

    saveTagList = () => {
        $.ajax({
            url: `${this.props.defaultURL}savetag?usrname=${this.props.userName}&taskname=${this.props.taskName}`,
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
            url: `${this.props.defaultURL}loadtag?usrname=${this.props.userName}&taskname=${this.props.taskName}`,
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
                console.log('getTagList failed');
            }
        })
    }

    initTagString = () => {
        if(this.props.boxList[0])
            document.getElementById('mySelect').value = this.props.boxList[0].tag;
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
                        <option key={tagString}>{tagString}</option>
                    ))
                }
                </select>
                {
                    this.props.userLevel !== 0 ?
                    <button onClick={this.deleteCurrentTag} className="w3-card w3-button w3-green margin-top-5">删除当前标签</button>
                    : null
                }
                {
                    this.props.userLevel !== 0 ?
                    <div className="w3-card margin-top-5 flex-box" style={{alignItems: 'center'}}>
                        <input id="new-tag-string" className="w3-input" type="text" style={{flex: '1', border: 'none', width: '50%'}}/>
                        <button className="w3-button w3-green" onClick={this.addTagString} style={{width: '15%'}}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                        <button onClick={this.saveTagList} className="w3-button w3-green" style={{width: '35%'}}>保存标签列表</button>
                    </div>
                    : null
                }
                <ul className="w3-ul w3-hoverable margin-top-5"  style={{overflowY: 'auto', flex: '1'}}>{
                        <li className="w3-hover-green">
                            <span>标签:{this.props.boxList[0] ? this.props.boxList[0].tag : 'none'}</span>
                            <div>额外信息:<input id="myInput" type="text" onChange={this.onChangeBoxInfo.bind(this, 0)} value={this.props.boxList[0] ? this.props.boxList[0].info : ''}/></div>
                        </li>
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

export default TagObjectView
