import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { autoTagImages } from '../actions/app_action';
import TagSelector from '../TagSelector';
import { DEFAULT_URL } from '../utils/global_config';

class TagPointView extends Component {
    state = {
        showFindModeView: false,
        autoTagNum: 1,
        autoTagStart: 1,
        showPremodelSelect: false,
        pretrainmodelList: [],
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
      this.setState({
        autoTagNum: e.target.value
      })
    }

    handleAutoTagStart = (e) => {
      this.setState({
        autoTagStart: e.target.value
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
        document.removeEventListener('keyup', this.pageUpAndDownListener);
    }

    componentDidMount() {
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

    onDeleteBox = (index) => {
        this.props.onDeleteBox(index);
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

    copyLastBoxList = () => {
      this.props.getBoxList(this.props.selectedImageNum - 1 >= 0 ? this.props.selectedImageNum - 1 : 0);
      this.props.needPostTagList();
      this.shouldShowPremodelSelect();
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
                      <button onClick={this.copyLastBoxList} className="w3-button w3-green" style={{flexShrink: '0', margin: '5px 2px', height: '45px'}}>获取上一张标注</button>
                      <div style={{display: 'flex', width: '100%', height: '45px', justifyContent: 'space-around'}}>
                        <button onClick={this.shouldShowPremodelSelect} className="w3-button w3-green" style={{width: '49%'}}>取消</button>
                        <button onClick={this.autoTagImages} className="w3-button w3-green" style={{width: '49%'}}>确定</button>
                      </div>
                    </div>
                  </div>}
                {
                    this.props.userLevel === 3 || this.props.userLevel === 2 ?
                        this.state.showFindModeView ?
                        <button onClick={this.shouldShowFindModeView} className="w3-button w3-card w3-green">退出查找模式</button>
                        : <button onClick={this.shouldShowFindModeView} className="w3-button w3-card w3-green">查找当前标签</button>
                    : null
                }
                <TagSelector />
                <ul className="w3-ul w3-hoverable margin-top-5"  style={{overflowY: 'auto', flex: '1'}}>{
                    this.props.boxList.map((box, index) => (
                        <li className="w3-hover-green" key={box.x_start + box.y_end + index}>
                            <div>
                                <span>序号: {index + 1}</span>
                                <i onClick={this.onDeleteBox.bind(this, index)} className="fa fa-times et-tag-button w3-right"></i>
                            </div>
                            <div>
                                <div className="flex-box" style={{alignItems: 'center', padding: '5px 0px'}}>
                                    <span>标签: </span>
                                    <i onClick={this.props.addNewTagToBox.bind(this, index)} className="fa fa-plus-circle et-tag-button"></i>
                                    <div className="flex-box" style={{overflowX: 'auto', marginLeft: '4px'}}>{
                                        box.tag.map((tag, index2) => (
                                            <div key={tag + index2} className="flex-box" style={{border: '2px solid black', alignItems: 'center', marginLeft: '2px', paddingLeft: '3px', paddingRight: '3px', whiteSpace: 'nowrap'}}>
                                                {tag}
                                                <i onClick={this.props.removeTagFromBox.bind(this, index, index2)} className="fa fa-times et-tag-button"></i>
                                            </div>
                                        ))
                                    }</div>
                                </div>
                            </div>
                            <div>额外信息:<input className="w3-input" type="text" onChange={this.onChangeBoxInfo.bind(this, index)} value={this.props.boxList[index].info}/></div>
                        </li>
                    ))
                }</ul>
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

export default TagPointView
