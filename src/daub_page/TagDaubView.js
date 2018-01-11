import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createObject, changeObjectIndex, removeObject, addTag, removeTag } from './daub_action';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Close';


class TagDaubView extends Component {
    state = {
        listNameList: [], // 'tagname','tagname2'
        tagStringList: [], // '1','2','3'
        tagStringListAll: {}, // {tagname: ['1','2','3'], tagname2: ['4','5','6']}
        newTagString: '',
        newListName: '',
        showEditView: false,
        showTagEditView: false,
        showListNameEditView: false,
        showAddNewTagStringView: false,
        showAddNewListNameView: false,
        showFindModeView: false,
        autoTagNum: 1,
        autoTagStart: 1,
        showPremodelSelect: false,
        pretrainmodelList: [],
        currentColor: ''
    }

    shouldShowPremodelSelect = () => {
      this.setState({
        showPremodelSelect: !this.state.showPremodelSelect
      })
    }

    changeAutoTagStart = (index) => {
      this.setState({
        autoTagStart: index
      })
    }

    handleAutoTagNum = (e) => {
      let value = parseInt(e.target.value, 10);
      if(value < 1) value = 1;
      this.setState({
        autoTagNum: value
      })
    }

    handleAutoTagStart = (e) => {
      let value = parseInt(e.target.value, 10);
      if(value < 1) value = 1;
      this.setState({
        autoTagStart: value
      })
    }

    shouldShowFindModeView = () => {
        if(this.state.showFindModeView) {
            this.props.onChangeBrowserMode('normal');
        } else {
            this.props.onChangeBrowserMode('find');
        }
        this.setState({showFindModeView: !this.state.showFindModeView});
    }

    shouldShowEditView = () => {
        this.setState({showEditView: !this.state.showEditView});
    }

    shouldShowListNameEditView = () => {
        this.setState({
          newListName: '',
          showListNameEditView: !this.state.showListNameEditView
        });
    }

    shouldShowTagEditView = () => {
        this.setState({
          newTagString: '',
          showTagEditView: !this.state.showTagEditView
        });
    }

    shouldShowAddNewTagStringView = () => {
        this.setState({showAddNewTagStringView: !this.state.showAddNewTagStringView});
    }

    shouldShowAddNewListNameView = () => {
        this.setState({showAddNewListNameView: !this.state.showAddNewListNameView});
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.pageUpAndDownListener);
    }

    componentDidMount() {
        const that = this;
        this.loadTagList();
        document.addEventListener('keyup', this.pageUpAndDownListener);
        fetch(`${this.props.defaultURL}getpretrainmodelall?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
          .then((response) => (response.json()))
          .then((result) => {
            this.setState({
              pretrainmodelList: result
            })
          })
    }

    pageUpAndDownListener = (e) => {
        if(e.keyCode === 33) {
            this.props.onPreviousImageList();
        } else if(e.keyCode === 34) {
            this.props.onNextImageList();
        }
    }

    addTagString = () => {
        const tagString = document.getElementById('new-tag-string').value;
        if(tagString.trim() !== '') {
            document.getElementById('new-tag-string').value = '';
            this.setState((state) => {
                state.tagStringList = state.tagStringList.concat([tagString]);
                state.tagStringListAll[document.getElementById('mySelectForListName-daub').value] = state.tagStringList;
            }, () => {
              this.saveTagList();
              this.props.onChangeTagStringList(this.state.tagStringList);
            })
            this.shouldShowAddNewTagStringView();
        } else {
            window.alert('标签名不能为空');
        }
    }

    addListName = () => {
        const listName = document.getElementById('new-list-name').value;
        if(listName.trim() !== '') {
            document.getElementById('new-list-name').value = '';
            this.setState((state) => {
                state.listNameList = state.listNameList.concat([listName]);
                state.tagStringListAll[listName] = ['None'];
            }, () => this.saveTagList())
            this.shouldShowAddNewListNameView();
        } else {
            window.alert('标签组名不能为空');
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
                }, () => {
                    this.saveTagList();
                    this.props.on
                    ();
                })
            }
        }
    }

    deleteCurrentListName = () => {
        const result = window.confirm('确定删除当前标签组吗?');
        if(result) {
            if(this.state.listNameList.length === 1) {
                window.alert('不能删除最后一个标签组');
            }else {
                const listName = document.getElementById('mySelectForListName-daub').value;
                const index = this.state.listNameList.indexOf(listName);
                this.setState((state) => {
                    state.listNameList.splice(index, 1);
                    delete state.tagStringListAll[listName];
                }, () => {
                    this.saveTagList();
                    this.updateTagStringList();
                })
            }
        }
    }

    updateTagStringList = () => {
        const listName = document.getElementById('mySelectForListName-daub').value;
        this.setState({tagStringList: this.state.tagStringListAll[listName]}, () => {this.props.onChangeTagString()});
    }

    saveTagList = () => {
        const request = new XMLHttpRequest();
        request.open('POST', `${this.props.defaultURL}savetag?usrname=${this.props.userName}&taskname=${this.props.taskName}`);
        const data = JSON.stringify(this.state.tagStringList);
        request.send(JSON.stringify({
            listname: this.state.listNameList,
            taglist: this.state.tagStringListAll
        }));
        request.onload = () => {
            console.log('post tagStringList success');
        }
    }

    loadTagList = () => {
      fetch(`${this.props.defaultURL}loadtag?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
        .then((response) => response.json())
        .then((data) => {
          if(data.listname[0] === 'tagname' && data.taglist.tagname[0] === 'tag1' && data.taglist.tagname[1] === 'tag2' && data.taglist.tagname[2] === 'tag3') {
            const listNameList = ['tagname'];
            const tagStringListAll = {
              tagname: ['tag1']
            };
            const tagStringList = tagStringListAll['tagname'];
            this.setState({
              tagStringList,
              listNameList,
              tagStringListAll
            }, () => {
              this.props.onChangeTagStringList(this.state.tagStringList);
            })
          } else {
            const listNameList = data.listname;
            const tagStringListAll = data.taglist;
            const tagStringList = tagStringListAll[listNameList[0]];
            this.setState({
              tagStringList,
              listNameList,
              tagStringListAll
            }, () => {
              this.props.onChangeTagStringList(this.state.tagStringList);
            })
          }
        })
    }

    getRandomColor = () => {
      return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
    }

    onChangeBoxInfo(index, e) {
        this.props.onChangeBoxInfo(index, e.target.value);
    }

    getImageListByTag = () => {
        if(this.state.targetTag.trim() !== '') {
            this.props.getImageListByTag(this.state.targetTag);
            this.setState({targetTag: ''})
        }
    }

    handleNewTagString = (e) => {
        this.setState({newTagString: e.target.value});
    }

    handleNewListName = (e) => {
        this.setState({newListName: e.target.value});
    }

    editTagString = () => {
        if(this.state.newTagString.trim() !== '') {
            const oldTagString = document.getElementById('mySelect-daub').value;
            const newTagString = this.state.newTagString;
            this.setState((state) => {
                const newTagStringList = state.tagStringList.reduce((newTagStringList, tagString) => {
                    if(tagString === oldTagString) {
                        return newTagStringList.concat([newTagString]);
                    } else {
                        return newTagStringList.concat([tagString]);
                    }
                }, []);
                state.tagStringList = newTagStringList;
                state.tagStringListAll[document.getElementById('mySelectForListName-daub').value] = newTagStringList;
                state.newTagString = '';
            }, () => {
                this.saveTagList();
                this.props.editTagString(oldTagString, newTagString);
                this.props.onChangeTagString();
                this.shouldShowTagEditView();
            });
        } else {
            window.alert('新标签名不能为空');
        }
    }

    editListName = () => {
        const theNewListName = this.state.newListName;
        if(this.state.newListName.trim() !== '') {
            const oldListName = document.getElementById('mySelectForListName-daub').value;
            const newListName = this.state.newListName;
            this.setState((state) => {
                const index = state.listNameList.indexOf(oldListName);
                state.listNameList[index] = newListName;
                state.tagStringListAll = {
                    ...state.tagStringListAll,
                    [newListName]: state.tagStringListAll[oldListName]
                }
                delete state.tagStringListAll[oldListName];
                state.newListName = '';
            }, () => {
                document.getElementById('mySelectForListName-daub').value = theNewListName;
                this.saveTagList();
                this.shouldShowListNameEditView();
            });
        } else {
            window.alert('新标签组名不能为空');
        }
    }

    changeTagStringList = () => {
        const listName = document.getElementById('mySelectForListName-daub').value;
        this.setState({tagStringList: this.state.tagStringListAll[listName]}, () => {
            this.props.onChangeTagStringList(this.state.tagStringList);
        });
    }

    autoTagImages = () => {
      const theValue = document.getElementById('auto-tag-image-premodel-select').value;
      this.props.onAutoTagImages(this.state.autoTagStart, this.state.autoTagNum, theValue);
      this.shouldShowPremodelSelect();
    }

    createObject = () => {
      const color = this.getRandomColor();
      this.props.dispatch(createObject(color, document.getElementById('mySelect-daub').value));
    }

    changeObjectIndex = (index) => () => {
      this.props.dispatch(changeObjectIndex(index));
    }

    removeObject = (color, index) => () => {
      const result = window.confirm('确定删除该实例吗?');
      if(result) {
        const canvas = document.getElementById('selectedCanvas');
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for(let i=0; i<data.length; i=i+4) {
          const r = data[i + 0];
          const g = data[i + 1];
          const b = data[i + 2];
          if(r === color[0] && g === color[1] && b === color[2]) {
            data[i + 0] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
      this.props.dispatch(removeObject(index));
      this.props.shouldSaveDaub(true);
    }

    addTag = (index) => () => {
      const tag = document.getElementById('mySelect-daub').value
      const result = this.props.objects[index].tagList.filter((theTag) => (theTag === tag));
      if(result.length > 0) {
        window.alert('标签已存在');
      } else {
        this.props.dispatch(addTag(index, tag));
        this.props.shouldSaveDaub(true);
      }

    }

    removeTag = (index, index2) => () => {
      const result = this.props.objects[index].tagList.length;
      if(result > 1) {
        this.props.dispatch(removeTag(index, index2));
        this.props.shouldSaveDaub(true);
      } else {
        window.alert('不能删除最后一个标签');
      }
    }

    render() {
        return (
            <div className="flex-box flex-column" style={{justifyContent: 'center', height: '100%'}}>
                {this.state.showPremodelSelect &&
                  <div className="w3-modal" style={{background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{width: '460px', height: '208px', position: 'relative', display: 'flex', flexDirection: 'column', background: '#fafafa'}}>
                      <div style={{height: '50px', background: 'black', color: 'white', padding: '10px', fontSize: '17px'}}><span>选择训练模型</span></div>
                      <select id="auto-tag-image-premodel-select" className="w3-select" style={{height: '55px'}}>
                        {this.state.pretrainmodelList.map((pretrainmodel, index) => (
                          <option key={pretrainmodel + index}>{pretrainmodel}</option>
                        ))}
                      </select>
                      <div style={{display: 'flex', width: '100%', height: '45px', justifyContent: 'space-around', position: 'absolute', bottom: '2px'}}>
                        <button onClick={this.shouldShowPremodelSelect} className="w3-button w3-green" style={{width: '49%'}}>取消</button>
                        <button onClick={this.autoTagImages} className="w3-button w3-green" style={{width: '49%'}}>确定</button>
                      </div>
                    </div>
                  </div>}
                {this.props.userLevel === 3 || this.props.userLevel === 2
                  ? this.state.showFindModeView
                    ? <button onClick={this.shouldShowFindModeView} className="w3-button w3-card w3-green">退出查找模式</button>
                    : <button onClick={this.shouldShowFindModeView} className="w3-button w3-card w3-green">查找当前标签</button>
                  : null}
                <div className="flex-box margin-top-5">
                    <select onChange={this.changeTagStringList} id="mySelectForListName-daub" className="w3-select" style={{width: '50%'}}>
                    {this.state.listNameList.map((listName, index) => (
                      <option key={listName + index}>{listName}</option>
                    ))}
                    </select>
                    <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                    <select id="mySelect-daub" className="w3-select" style={{width: '50%'}}>
                    {this.state.tagStringList.map((tagString, index) => (
                      <option key={tagString + index}>
                        {tagString}
                      </option>
                    ))}
                    </select>
                </div>
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
                <button onClick={this.createObject} className="w3-button w3-green w3-card" style={{marginTop: '5px'}}>创建实例</button>
                <div style={{position: 'fixed', left: '20px', top: '100px', background: 'white', display: 'flex', padding: '6px 10px', fontSize: '13px', borderRadius: '7px', alignItems: 'center'}}>
                  <p style={{margin: '5px 0px'}}>画笔宽度:</p>
                  <input value={this.props.lineWidth} onChange={this.props.changeLineWidth} type="number" style={{width: '60px', paddingLeft: '5px', marginLeft: '5px'}} />
                  <div style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}>
                    <p style={{margin: '5px 0px'}}>橡皮擦:</p>
                    <input value={this.props.eraseMode} onChange={this.props.changeEraseMode} type="checkbox" style={{marginLeft: '5px'}} />
                  </div>
                </div>
                <List style={{overflowY: 'auto', flex: '1'}}>
                  {this.props.objects.map((object, index) => (
                    <ListItem key={object.color} button onClick={this.changeObjectIndex(index)} style={{background: `${this.props.objectIndex === index ? 'rgb(220,220,220)' : ''}`}}>
                      <Paper style={{width: '100%', padding: '10px'}} elevation={4}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <Typography type="body2">
                              序号: {index + 1}
                            </Typography>
                            <Typography type="body2" style={{marginLeft: '5px'}}>颜色:</Typography>
                            <div style={{width: '17px', height: '17px', background: `rgb(${object.color[0]},${object.color[1]}, ${object.color[2]})`, marginLeft: '5px'}} />
                          </div>
                          <div>
                            <IconButton aria-label="Delete" onClick={this.removeObject(object.color, index)}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </div>
                        <div>
                          <div className="flex-box" style={{alignItems: 'center', padding: '5px 0px'}}>
                            <span>标签: </span>
                            <i onClick={this.addTag(index)} className="fa fa-plus-circle et-tag-button"></i>
                            <div className="flex-box" style={{overflowX: 'auto', marginLeft: '4px'}}>{
                              object.tagList.map((tag, index2) => (
                                <div key={tag + index2} className="flex-box" style={{border: '2px solid black', alignItems: 'center', marginLeft: '2px', paddingLeft: '3px', paddingRight: '3px', whiteSpace: 'nowrap'}}>
                                  {tag}
                                  <i onClick={this.removeTag(index, index2)} className="fa fa-times et-tag-button"></i>
                                </div>))
                            }</div>
                          </div>
                        </div>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
                <div>
                  <div className="flex-box margin-top-5 w3-card">
                      <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                      <input onChange={this.handleAutoTagStart} className="w3-input" type="number" value={this.state.autoTagStart} style={{width: '30%'}}/>
                      <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>标注<br/>数量</span>
                      <input onChange={this.handleAutoTagNum} className="w3-input" type="number" value={this.state.autoTagNum} style={{width: '30%'}}/>
                      <button onClick={this.shouldShowPremodelSelect} className="w3-button w3-green" style={{width: '30%'}}>自动标注</button>
                  </div>
                  <div className="flex-box margin-top-5 w3-card">
                      <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                      <input onChange={this.props.onHandleStartChange} className="w3-input" type="number" value={this.props.start} style={{width: '30%'}}/>
                      <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>每页<br/>数量</span>
                      <input onChange={this.props.onHandleNumChange} className="w3-input" type="number" value={this.props.num} style={{width: '30%'}}/>
                      <button onClick={this.props.onGetImageList} className="w3-button w3-green" style={{width: '30%'}}>获取图片</button>
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

const mapStateToProps = ({ daubReducer }) => ({
  objects: daubReducer.objects,
  objectIndex: daubReducer.objectIndex
})

export default connect(mapStateToProps, null, null, { withRef: true })(TagDaubView);
