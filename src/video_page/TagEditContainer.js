import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNewListName, saveTagList, editListName, editTagString, addNewTagString,
         deleteListName, deleteTagString } from '../actions/video_action';

class TagEditContainer extends Component {
  state = {
    showEditView: false,
    showListNameEditView: false,
    showTagEditView: false,
    showAddNewListNameView: false,
    showAddNewTagStringView: false,
    newListName: '',
    newTagString: '',
  }

  handleNewListName = (e) => {
    this.setState({
      newListName: e.target.value
    })
  }

  handleNewTagString = (e) => {
    this.setState({
      newTagString: e.target.value
    })
  }

  shouldShowEditView = () => {
    this.setState({
      showEditView: !this.state.showEditView
    })
  }

  shouldShowAddNewListNameView = () => {
    this.setState({
      showAddNewListNameView: !this.state.showAddNewListNameView
    })
  }

  shouldShowListNameEditView = () => {
    this.setState({
      newListName: '',
      showListNameEditView: !this.state.showListNameEditView
    })
  }

  shouldShowTagEditView = () => {
    this.setState({
      newTagString: '',
      showTagEditView: !this.state.showTagEditView
    })
  }

  shouldShowAddNewTagStringView = () => {
    if(document.getElementById('new-tag-string')) {
      document.getElementById('new-tag-string').value = '';
    }
    this.setState({
      showAddNewTagStringView: !this.state.showAddNewTagStringView
    })
  }

  editListName = () => {
    const theNewListName = this.state.newListName;
    if(this.state.newListName.trim() !== '') {
        const oldListName = document.getElementById('list-name-list-select').value;
        const newListName = this.state.newListName;
        this.props.dispatch(editListName(oldListName, newListName));
        this.shouldShowListNameEditView();
        setTimeout(() => {
          this.props.dispatch(saveTagList());
        }, 1000);
    } else {
        window.alert('新标签组名不能为空');
    }
  }

  editTagString = () => {
    if(this.state.newTagString.trim() !== '') {
        const listName = document.getElementById('list-name-list-select').value;
        const oldTagString = document.getElementById('tag-string-list-select').value;
        const newTagString = this.state.newTagString;
        this.props.dispatch(editTagString(listName, oldTagString, newTagString));
        this.shouldShowTagEditView();
        setTimeout(() => {
          this.props.dispatch(saveTagList());
        }, 1000);
    } else {
        window.alert('新标签名不能为空');
    }
  }

  addListName = () => {
    const listName = document.getElementById('new-list-name').value;
    if(listName.trim() !== '') {
        document.getElementById('new-list-name').value = '';
        this.props.dispatch(addNewListName(listName));
        this.shouldShowAddNewListNameView();
        setTimeout(() => {
          this.props.dispatch(saveTagList());
        }, 1000);
    } else {
        window.alert('标签组名不能为空');
    }
  }

  addTagString = () => {
    const listName = document.getElementById('list-name-list-select').value;
    const tagString = document.getElementById('new-tag-string').value;
    if(tagString.trim() !== '') {
        this.props.dispatch(addNewTagString(listName, tagString));
        this.shouldShowAddNewTagStringView();
        setTimeout(() => {
          this.props.dispatch(saveTagList());
        }, 1000);
    } else {
        window.alert('标签名不能为空');
    }
  }

  deleteCurrentListName = () => {
    const result = window.confirm('确定删除当前标签组吗?');
    if(result) {
        if(this.props.listNameList.length === 1) {
            window.alert('不能删除最后一个标签组');
        }else {
            const listName = document.getElementById('list-name-list-select').value;
            this.props.dispatch(deleteListName(listName));
            setTimeout(() => {
              this.props.dispatch(saveTagList());
            }, 1000);
        }
    }
  }

  deleteCurrentTag = () => {
    const result = window.confirm('确定删除当前标签吗?');
    if(result) {
        if(this.props.tagStringList.length === 1) {
            window.alert('不能删除最后一个标签');
        } else {
            const listName = document.getElementById('list-name-list-select').value;
            const tagString = document.getElementById('tag-string-list-select').value;
            this.props.dispatch(deleteTagString(listName, tagString));
            setTimeout(() => {
              this.props.dispatch(saveTagList());
            }, 1000);
        }
    }
  }

  render() {
    return (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', flexGrow: '1'}}>
        {
            this.props.userLevel !== 0 ?
                this.state.showEditView ?
                    this.props.userLevel === 3 || this.props.userLevel === 2 ?
                        this.state.showListNameEditView ?
                        <div className="flex-box w3-card margin-top-5">
                            <input onChange={this.handleNewListName} value={this.state.newListName} placeholder="请输入新的标签组名" className="w3-input" type="text"/>
                            <button onClick={this.editListName} className="w3-button w3-green" style={{width: '26%'}}>确定</button>
                            <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                            <button onClick={this.shouldShowListNameEditView} className="w3-button w3-green" style={{width: '26%'}}>取消</button>
                        </div>
                        : <button onClick={this.shouldShowListNameEditView} className="w3-card w3-button w3-green margin-top-5">修改当前标签组名</button>
                    : null
                :null
            :null
        }
        {
            this.props.userLevel !== 0 ?
                this.state.showEditView ?
                    this.props.userLevel === 3 || this.props.userLevel === 2 ?
                        this.state.showTagEditView ?
                        <div className="flex-box w3-card margin-top-5">
                            <input onChange={this.handleNewTagString} value={this.state.newTagString} placeholder="请输入新的标签名" className="w3-input" type="text"/>
                            <button onClick={this.editTagString} className="w3-button w3-green" style={{width: '26%'}}>确定</button>
                            <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                            <button onClick={this.shouldShowTagEditView} className="w3-button w3-green" style={{width: '26%'}}>取消</button>
                        </div>
                        : <button onClick={this.shouldShowTagEditView} className="w3-card w3-button w3-green margin-top-5">修改当前标签名</button>
                    : null
                :null
            :null
        }
        {
            this.props.userLevel !== 0 ?
                this.state.showEditView ?
                    this.state.showAddNewListNameView ?
                        <div className="w3-card margin-top-5 flex-box">
                            <input placeholder="请输入新的标签组名" id="new-list-name" className="w3-input" type="text"/>
                            <button className="w3-button w3-green" onClick={this.addListName} style={{width: '26%'}}>确定</button>
                            <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                            <button className="w3-button w3-green" onClick={this.shouldShowAddNewListNameView} style={{width: '26%'}}>取消</button>
                        </div>
                        : <button onClick={this.shouldShowAddNewListNameView} className="w3-button w3-green w3-card margin-top-5">添加新标签组</button>
                : null
            :null
        }
        {
            this.props.userLevel !== 0 ?
                this.state.showEditView ?
                    this.state.showAddNewTagStringView ?
                        <div className="w3-card margin-top-5 flex-box">
                            <input placeholder="请输入新的标签名" id="new-tag-string" className="w3-input" type="text"/>
                            <button className="w3-button w3-green" onClick={this.addTagString} style={{width: '26%'}}>确定</button>
                            <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                            <button className="w3-button w3-green" onClick={this.shouldShowAddNewTagStringView} style={{width: '26%'}}>取消</button>
                        </div>
                        : <button onClick={this.shouldShowAddNewTagStringView} className="w3-button w3-green w3-card margin-top-5">添加新标签</button>
                : null
            :null
        }
        {
            this.props.userLevel !== 0 ?
                this.state.showEditView ?
                    <div className="flex-box flex-column">
                        <button onClick={this.deleteCurrentListName} className="w3-card w3-button w3-green margin-top-5">删除当前标签组</button>
                        <button onClick={this.deleteCurrentTag} className="w3-card w3-button w3-green margin-top-5">删除当前标签</button>
                        <button onClick={this.shouldShowEditView} className="w3-button w3-green w3-card margin-top-5">退出编辑</button>
                    </div>
                :null
            :null
        }
        {
            this.props.userLevel !== 0 ?
                this.state.showEditView ?
                null
                : <button onClick={this.shouldShowEditView} className="w3-button w3-green w3-card margin-top-5">编辑标签</button>
            :null
        }
      </div>
    )
  }
}

const mapStateToProps = ({ appReducer, videoReducer }) => ({
  userLevel: appReducer.userLevel,
  listNameList: videoReducer.listNameList,
  tagStringList: videoReducer.tagStringList
})

export default connect(mapStateToProps)(TagEditContainer);
