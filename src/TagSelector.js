import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initTagSelector, saveSegmentAnnotatorLabels } from './actions/app_action';
import { segmentAnnotator } from './segment_page/SegmentView';
import { DEFAULT_URL } from './utils/global_config';

class TagSelector extends Component {
  state = {
    showEditView: false,
    listName: '',
    tagName: '',
    newList: '',
    newTag: '',
    showInput: []
  }

  componentDidMount() {
    this.loadTagList();
  }

  handleCurrentList = (e) => {
    this.props.dispatch(initTagSelector({
      currentList: e.target.value,
      tagStringList: this.props.tagStringListAll[e.target.value],
      currentTag: this.props.tagStringListAll[e.target.value][0]
    }))
  }

  handleCurrentTag = (e) => {
    this.props.dispatch(initTagSelector({
      currentTag: e.target.value
    }))
    if(this.props.segment) {
      const index = this.props.tagStringList.indexOf(e.target.value);
      const selected = document.getElementsByClassName('legend-selected')[0];
      const item = document.getElementsByClassName('legend-item')[index];
      if (selected)
        selected.classList.remove('legend-selected');
      segmentAnnotator.setCurrentLabel(index);
      item.classList.add('legend-selected');
    }
  }

  loadTagList = () => {
    fetch(`${DEFAULT_URL}loadtag?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
      .then((response) => response.json())
      .then((data) => {
        if(data.listname[0] === 'tagname' && data.taglist.tagname[0] === 'tag1' && data.taglist.tagname[1] === 'tag2' && data.taglist.tagname[2] === 'tag3') {
          const listNameList = ['tagname'];
          const tagStringListAll = {
            tagname: ['tag1']
          };
          const tagStringList = tagStringListAll['tagname'];
          this.props.dispatch(initTagSelector({
            tagStringList,
            listNameList,
            tagStringListAll,
            currentList: 'tagname',
            currentTag: 'tag1'
          }))
        } else {
          const listNameList = data.listname;
          const tagStringListAll = data.taglist;
          const tagStringList = tagStringListAll[listNameList[0]];
          this.props.dispatch(initTagSelector({
            tagStringList,
            listNameList,
            tagStringListAll,
            currentList: listNameList[0],
            currentTag: tagStringListAll[listNameList[0]][0]
          }))
        }
      })
  }

  saveTagList = () => {
    fetch(`${DEFAULT_URL}savetag?usrname=${this.props.userName}&taskname=${this.props.taskName}`, {
      method: 'POST',
      body: JSON.stringify({
        listname: this.props.listNameList,
        taglist: this.props.tagStringListAll
      })
    })
  }

  handleListName = (e) => {
    this.setState({listName: e.target.value});
  }

  changeListName = () => {
    if(this.state.listName.trim() !== '') {
      const { listName } = this.state;
      const { currentList, listNameList, tagStringListAll } = this.props;
      const newName = listName;
      const oldName = currentList;
      let new_listNameList = listNameList, new_tagStringListAll = tagStringListAll;
      this.setState((state) => {
          const index = new_listNameList.indexOf(oldName);
          new_listNameList[index] = newName;
          new_tagStringListAll = {
              ...new_tagStringListAll,
              [newName]: new_tagStringListAll[oldName]
          }
          delete new_tagStringListAll[oldName];
          this.props.dispatch(initTagSelector({
            listNameList: new_listNameList,
            tagStringListAll: new_tagStringListAll,
            currentList: newName,
          }))
          state.listName = '';
      }, () => {
          this.saveTagList();
          this.shouldShowInput('EDIT_LIST_NAME')();
      });
    } else {
        window.alert('新标签组名不能为空');
    }
  }

  handleTagName = (e) => {
    this.setState({tagName: e.target.value});
  }

  changeTagName = () => {
    if(this.state.tagName.trim() !== '') {
      const oldName = this.props.currentTag;
      const newName = this.state.tagName;
      const { tagStringList, tagStringListAll, currentList } = this.props;
      let new_tagStringList = tagStringList, new_tagStringListAll = tagStringListAll;
      new_tagStringList = new_tagStringList.reduce((newTagStringList, tagName) => {
          if(tagName === oldName) {
              return newTagStringList.concat([newName]);
          } else {
              return newTagStringList.concat([tagName]);
          }
      }, []);
      new_tagStringListAll[currentList] = new_tagStringList;
      this.props.dispatch(initTagSelector({
        tagStringList: new_tagStringList,
        tagStringListAll: new_tagStringListAll,
        currentTag: newName
      }))
      this.setState({
        tagName: ''
      }, () => {
          this.saveTagList();
          this.editTagString(oldName, newName);
          this.shouldShowInput('EDIT_TAG_NAME')();
      });
    } else {
        window.alert('新标签名不能为空');
    }
  }

  handleNewList = (e) => {
    this.setState({newList: e.target.value});
  }

  addNewList = () => {
    const { newList } = this.state;
    if(newList.trim() !== '') {
      const { listNameList, tagStringListAll } = this.props;
      let new_listNameList = listNameList, new_tagStringListAll = tagStringListAll;
      new_listNameList = new_listNameList.concat([newList]);
      new_tagStringListAll[newList] = ['None'];
      this.props.dispatch(initTagSelector({
        listNameList: new_listNameList,
        tagStringListAll: new_tagStringListAll
      }))
      this.setState((state) => {
        state.newList = '';
      }, () => this.saveTagList())
      this.shouldShowInput('ADD_NEW_LIST')();
    } else {
      window.alert('标签组名不能为空');
    }
  }

  handleNewTag = (e) => {
    this.setState({newTag: e.target.value});
  }

  addNewTag = () => {
    const { newTag } = this.state;
    const that = this;
    if(newTag.trim() !== '') {
      const { tagStringList, tagStringListAll, currentList } = this.props;
      let new_tagStringList = tagStringList, new_tagStringListAll = tagStringListAll;
      new_tagStringList = new_tagStringList.concat([newTag]);
      new_tagStringListAll[currentList] = new_tagStringList;
      this.props.dispatch(initTagSelector({
        tagStringList: new_tagStringList,
        tagStringListAll: new_tagStringListAll
      }))
      this.setState({
        newTag: ''
      }, () => {
        this.saveTagList();
      })
      this.shouldShowInput('ADD_NEW_TAG')();
      if(this.props.segment) {
        const input = document.getElementById('add-label-input');
        input.value = this.state.newTag;
        const button = document.getElementById('add-item-button');
        button.click();
        this.props.dispatch(initTagSelector({
          currentTag: this.state.newTag
        }))
        this.props.dispatch(saveSegmentAnnotatorLabels(segmentAnnotator.getLabels()));
      }
    } else {
      window.alert('标签名不能为空');
    }
  }

  deleteList = () => {
    const result = window.confirm('确定删除当前标签组吗?');
    if(result) {
      const { listNameList, tagStringListAll, currentList } = this.props;
      if(listNameList.length === 1) {
        window.alert('不能删除最后一个标签组');
      }else {
        const index = listNameList.indexOf(currentList);
        let new_listNameList = listNameList, new_tagStringListAll = tagStringListAll;
        new_listNameList.splice(index, 1);
        delete new_tagStringListAll[currentList];
        let new_currentList = new_listNameList[0], new_currentTag = new_tagStringListAll[new_currentList][0], new_tagStringList = new_tagStringListAll[new_currentList];
        this.props.dispatch(initTagSelector({
          tagStringListAll: new_tagStringListAll,
          listNameList: new_listNameList,
          tagStringList: new_tagStringList,
          currentTag: new_currentTag,
          currentList: new_currentList
        }))
        this.saveTagList();
      }
    }
  }

  deleteTag = () => {
    const result = window.confirm('确定删除当前标签吗?');
    if(result) {
      const { tagStringList, tagStringListAll, currentTag, currentList } = this.props;
      if(tagStringList.length === 1) {
        window.alert('不能删除最后一个标签');
      }else {
        const index = tagStringList.indexOf(currentTag);
        let new_tagStringList = tagStringList, new_tagStringListAll = tagStringListAll, new_currentTag;
        new_tagStringList.splice(index, 1);
        new_tagStringListAll[currentList] = new_tagStringList;
        if(index > 0) {
          new_currentTag = new_tagStringList[index - 1];
        } else {
          new_currentTag = new_tagStringList[0];
        }
        this.props.dispatch(initTagSelector({
          tagStringList: new_tagStringList,
          tagStringListAll: new_tagStringListAll,
          currentTag: new_currentTag
        }))
        this.saveTagList();
      }
    }
  }

  getEditView = () => {
    const { userLevel } = this.props;
    const { listName, showInput, tagName, newList, newTag } = this.state;
    let flag = false;
    if(userLevel === 2 || userLevel === 3) flag = true;
    return (
      <div className="flex-box flex-column">
        {flag && <div className="flex-box flex-column">
          <EditListName
            handleListName={this.handleListName}
            listName={listName}
            shouldShowInput={this.shouldShowInput}
            showInput={showInput}
            changeListName={this.changeListName}
            type="EDIT_LIST_NAME" />
          <EditTagName
            handleTagName={this.handleTagName}
            tagName={tagName}
            shouldShowInput={this.shouldShowInput}
            showInput={showInput}
            changeTagName={this.changeTagName}
            type="EDIT_TAG_NAME" />
        </div>}
        <AddNewList
          handleNewList={this.handleNewList}
          newList={newList}
          shouldShowInput={this.shouldShowInput}
          showInput={showInput}
          addNewList={this.addNewList}
          type="ADD_NEW_LIST" />
        <AddNewTag
          handleNewTag={this.handleNewTag}
          newTag={newTag}
          shouldShowInput={this.shouldShowInput}
          showInput={showInput}
          addNewTag={this.addNewTag}
          type="ADD_NEW_TAG" />
        <DeleteListOrTag
          deleteList={this.deleteList}
          deleteTag={this.deleteTag} />
        <button onClick={this.shouldShowEditView} className="w3-button w3-green w3-card margin-top-5">退出编辑</button>
      </div>
    )
  }

  editTagString = (oldTagString, newTagString) => {
    fetch(`${DEFAULT_URL}changetag?usrname=${this.props.userName}&taskname=${this.props.taskName}`, {
      method: 'POST',
      body: JSON.stringify({
        oldtag: oldTagString,
        newtag: newTagString
      })
    })
  }

  shouldShowEditView = () => {
    this.setState((preState) => ({
      showEditView: !preState.showEditView
    }))
  }

  shouldShowInput = (type) => () => {
    this.setState((state) => {
      if(state.showInput.indexOf(type) > -1) {
        return {
          showInput: state.showInput.filter(item => item !== type)
        }
      } else {
        return {
          showInput: [...state.showInput, type]
        }
      }
    })
  }

  render() {
    const { showEditView } = this.state;
    const { userLevel, listNameList, tagStringList, currentList, currentTag } = this.props;
    return (
      <div style={{padding: '2px'}}>
        <div className="flex-box" style={{justifyContent: 'space-between'}}>
          <select onChange={this.handleCurrentList} value={currentList} className="w3-select" style={{marginRight: '2px'}}>
            {listNameList.map((listName, index) => (
              <option key={listName + index}>{listName}</option>
            ))}
          </select>
          <select onChange={this.handleCurrentTag} value={currentTag} className="w3-select">
            {tagStringList.map((tagString, index) => (
              <option key={tagString + index}>
                {tagString}
              </option>
            ))}
          </select>
        </div>
        {userLevel !== 0 && !showEditView &&
          <button onClick={this.shouldShowEditView} className="w3-button w3-green w3-card margin-top-5" style={{width: '100%'}}>编辑标签</button>}
        {userLevel !== 0 && showEditView && this.getEditView()}
      </div>
    )
  }
}

const EditListName = ({ handleListName, listName, shouldShowInput, showInput, changeListName, type }) => (
  showInput.indexOf(type) > -1
  ? <div className="flex-box w3-card margin-top-5">
      <input onChange={handleListName} value={listName} placeholder="请输入新的标签组名" className="w3-input" type="text"/>
      <button onClick={changeListName} className="w3-button w3-green" style={{width: '26%'}}>确定</button>
      <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
      <button onClick={shouldShowInput(type)} className="w3-button w3-green" style={{width: '26%'}}>取消</button>
  </div>
  : <button onClick={shouldShowInput(type)} className="w3-card w3-button w3-green margin-top-5">修改当前标签组名</button>
)

const EditTagName = ({ handleTagName, tagName, shouldShowInput, showInput, changeTagName, type }) => (
  showInput.indexOf(type) > -1
  ? <div className="flex-box w3-card margin-top-5">
      <input onChange={handleTagName} value={tagName} placeholder="请输入新的标签名" className="w3-input" type="text"/>
      <button onClick={changeTagName} className="w3-button w3-green" style={{width: '26%'}}>确定</button>
      <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
      <button onClick={shouldShowInput(type)} className="w3-button w3-green" style={{width: '26%'}}>取消</button>
  </div>
  : <button onClick={shouldShowInput(type)} className="w3-card w3-button w3-green margin-top-5">修改当前标签名</button>
)

const AddNewList = ({ handleNewList, newList, shouldShowInput, showInput, addNewList, type }) => (
  showInput.indexOf(type) > -1
    ? <div className="w3-card margin-top-5 flex-box">
        <input placeholder="请输入新的标签组名" onChange={handleNewList} value={newList} className="w3-input" type="text"/>
        <button className="w3-button w3-green" onClick={addNewList} style={{width: '26%'}}>确定</button>
        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
        <button className="w3-button w3-green" onClick={shouldShowInput(type)} style={{width: '26%'}}>取消</button>
    </div>
    : <button onClick={shouldShowInput(type)} className="w3-button w3-green w3-card margin-top-5">添加新标签组</button>
)

const AddNewTag = ({ handleNewTag, newTag, shouldShowInput, showInput, addNewTag, type }) => (
  showInput.indexOf(type) > -1
    ? <div className="w3-card margin-top-5 flex-box">
        <input placeholder="请输入新的标签名" onChange={handleNewTag} value={newTag} className="w3-input" type="text"/>
        <button className="w3-button w3-green" onClick={addNewTag} style={{width: '26%'}}>确定</button>
        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
        <button className="w3-button w3-green" onClick={shouldShowInput(type)} style={{width: '26%'}}>取消</button>
    </div>
    : <button onClick={shouldShowInput(type)} className="w3-button w3-green w3-card margin-top-5">添加新标签</button>
)

const DeleteListOrTag = ({ deleteList, deleteTag }) => (
  <div className="flex-box flex-column">
      <button onClick={deleteList} className="w3-card w3-button w3-green margin-top-5">删除当前标签组</button>
      <button onClick={deleteTag} className="w3-card w3-button w3-green margin-top-5">删除当前标签</button>
  </div>
)

const mapStateToProps = ({ appReducer }) => ({
  defaultURL: appReducer.defaultURL,
  userName: appReducer.userName,
  taskName: appReducer.taskName,
  userLevel: appReducer.userLevel,
  tagStringList: appReducer.tagSelector.tagStringList,
  listNameList: appReducer.tagSelector.listNameList,
  tagStringListAll: appReducer.tagSelector.tagStringListAll,
  currentList: appReducer.tagSelector.currentList,
  currentTag: appReducer.tagSelector.currentTag
})

export default connect(mapStateToProps)(TagSelector);
