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
import TagSelector from '../TagSelector';
import { DEFAULT_URL } from '../utils/global_config';

class TagDaubView extends Component {
    state = {
        showFindModeView: false,
        autoTagNum: 1,
        autoTagStart: 1,
        showPremodelSelect: false,
        pretrainmodelList: [],
        currentColor: '',
        movePaintBox: false,
        paintBox: {
          x: 0,
          y: 0,
          left: 20,
          top: 100
        }
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

    componentWillUnmount() {
      this.removeDragListener();
        document.removeEventListener('keyup', this.pageUpAndDownListener);
    }

    componentDidMount() {
      this.addDragListener();
        const that = this;
        document.addEventListener('keyup', this.pageUpAndDownListener);
        fetch(`${DEFAULT_URL}getpretrainmodelall?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
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

    autoTagImages = () => {
      const theValue = document.getElementById('auto-tag-image-premodel-select').value;
      this.props.onAutoTagImages(this.state.autoTagStart, this.state.autoTagNum, theValue);
      this.shouldShowPremodelSelect();
    }

    createObject = () => {
      const color = this.getRandomColor();
      this.props.dispatch(createObject(color, this.props.currentTag));
      setTimeout(() => {
        this.props.dispatch(changeObjectIndex(this.props.objects.length - 1));
      }, 0)
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
        this.props.dispatch(removeObject(index));
        this.props.shouldSaveDaub(true);
      }
    }

    addTag = (index) => () => {
      const tag = this.props.currentTag;
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

    dragMDListener = (e) => {
      this.setState({
        movePaintBox: true,
        paintBox: {
          x: e.clientX,
          y: e.clientY,
          left: this.state.paintBox.left,
          top: this.state.paintBox.top
        }
      })
    }

    dragMMListener = (e) => {
      const { paintBox, movePaintBox } = this.state;
      if(movePaintBox) {
        const x = e.clientX;
        const y = e.clientY;
        const left = paintBox.left + x - paintBox.x;
        const top = paintBox.top + y - paintBox.y;
        this.setState({
          paintBox: {
            x,
            y,
            left,
            top
          }
        })
      }
    }

    dragMUListener = (e) => {
      const { paintBox, movePaintBox } = this.state;
      if(movePaintBox) {
        const x = e.clientX - paintBox.x;
        const y = e.clientY - paintBox.y;
        const left = paintBox.left + x;
        const top = paintBox.top + y;
        this.setState({
          movePaintBox: false,
          paintBox: {
            x: 0,
            y: 0,
            left,
            top
          }
        })
      }
    }

    addDragListener = () => {
      const paintBox = document.getElementById('paint-box');
      paintBox.addEventListener('mousedown', this.dragMDListener);
      window.addEventListener('mousemove', this.dragMMListener);
      window.addEventListener('mouseup', this.dragMUListener);
    }

    removeDragListener = () => {
      const paintBox = document.getElementById('paint-box');
      paintBox.removeEventListener('mousedown', this.dragMDListener);
      window.removeEventListener('mousemove', this.dragMMListener);
      window.removeEventListener('mouseup', this.dragMUListener);
    }

    render() {
      const { paintBox } = this.state;
      const { lineWidth, changeLineWidth, eraseMode, changeEraseMode } = this.props;
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
                <TagSelector />
                <button onClick={this.createObject} className="w3-button w3-green w3-card" style={{marginTop: '5px'}}>创建实例</button>
                <PaintSetting
                  lineWidth={lineWidth}
                  changeLineWidth={changeLineWidth}
                  eraseMode={eraseMode}
                  changeEraseMode={changeEraseMode}
                  left={paintBox.left}
                  top={paintBox.top} />
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

const PaintSetting = ({ left, top, lineWidth, changeLineWidth, eraseMode, changeEraseMode }) => (
  <div style={{position: 'fixed', left: `${left}px`, top: `${top}px`, background: 'white', display: 'flex', padding: '6px 10px', fontSize: '13px', borderRadius: '4px', alignItems: 'center', userSelect: 'none'}}>
    <div id="paint-box" style={{width: '15px', height: '100%', position: 'absolute', left: '-12px', background: 'white', borderRadius: '4px 0px 0px 4px'}}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(0,0,0,0.3)'}}>
        <div className="drag-circle"/>
        <div className="drag-circle"/>
        <div className="drag-circle"/>
      </div>
    </div>
    <p style={{margin: '5px 0px'}}>画笔宽度:</p>
    <input value={lineWidth} onChange={changeLineWidth} type="number" style={{width: '60px', paddingLeft: '5px', marginLeft: '5px'}} />
    <div style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}>
      <p style={{margin: '5px 0px'}}>橡皮擦:</p>
      <input value={eraseMode} onChange={changeEraseMode} type="checkbox" style={{marginLeft: '5px'}} />
    </div>
  </div>
)

const mapStateToProps = ({ daubReducer, appReducer }) => ({
  objects: daubReducer.objects,
  objectIndex: daubReducer.objectIndex,
  currentTag: appReducer.tagSelector.currentTag
})

export default connect(mapStateToProps, null, null, { withRef: true })(TagDaubView);
