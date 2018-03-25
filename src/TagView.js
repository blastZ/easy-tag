import React, { Component } from 'react';
import CheckReviewSelector from './CheckReviewSelector';
import AutoTagView from './AutoTagView';
import SearchButton from './SearchButton';
import SetReasonView from './tagPage/popups/SetReasonView';
import TagSelector from './TagSelector';

class TagView extends Component {
    state = {
        autoTagNum: 1,
        autoTagStart: 1,
        showAutoTagView: false,
        pretrainmodelList: [],
        boxImgList: {}, //use key-value so this is object not array
        reasonList: [], //review reasons
        showSetReasonView: false
    }

    shouldShowSetReasonView = () => {
      this.setState({
        showSetReasonView: !this.state.showSetReasonView
      })
    }

    openAutoTagView = () => {
      this.setState({
        showAutoTagView: true
      })
    }

    closeAutoTagView = () => {
      this.setState({
        showAutoTagView: false
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

    componentWillUnmount() {
        document.removeEventListener('keyup', this.pageUpAndDownListener);
    }

    componentDidMount() {
        this.getReviewReason();
        document.addEventListener('keyup', this.pageUpAndDownListener);
    }

    getReviewReason = () => {
      fetch(`${this.props.defaultURL}loadreason?usrname=${this.props.userName}&taskname=${this.props.taskName}`)
        .then(response => response.json())
        .then((result) => {
          this.setState({
            reasonList: result.reasonlist
          })
        })
    }

    addNewReason = (reason) => {
      fetch(`${this.props.defaultURL}savereason?usrname=${this.props.userName}&taskname=${this.props.taskName}`, {
        method: 'POST',
        body: JSON.stringify({
          reasonlist: this.state.reasonList.concat([reason])
        })
      })
        .then(response => response.text())
        .then((result) => {
          this.getReviewReason();
        })
    }

    deleteReason = (index) => {
      const reasonList = this.state.reasonList;
      reasonList.splice(index, 1);
      fetch(`${this.props.defaultURL}savereason?usrname=${this.props.userName}&taskname=${this.props.taskName}`, {
        method: 'POST',
        body: JSON.stringify({
          reasonlist: reasonList
        })
      })
        .then(response => response.text())
        .then((result) => {
          this.getReviewReason();
        })
    }

    componentDidUpdate(preProps, preState) {
      if(this.props.boxList !== preProps.boxList) {
        this.setState({
          boxImgList: {}
        }, () => {
          for(let i=0; i<this.props.boxList.length; i++) {
            this.getBoxImg(this.props.boxList[i], i);
          }
        })
      }
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
        const newBoxImgList = this.state.boxImgList;
        delete newBoxImgList[index];
        const keyList = Object.keys(newBoxImgList);
        const max = Math.max(...keyList);
        let tag = false;
        for(let i=index + 1; i<=max; i++) {
          tag = true;
          newBoxImgList[i - 1] = newBoxImgList[i];
        }
        if(tag) delete newBoxImgList[max];
        this.setState({
          boxImgList: newBoxImgList
        })
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

    autoTagImages = (pretrainmodel) => {
      this.props.onAutoTagImages(this.state.autoTagStart, this.state.autoTagNum, pretrainmodel);
      this.closeAutoTagView();
    }

    inferLabel = () => {
      setTimeout(() => {
        const index = this.props.selectedImageNum;
        this.props.getImageList(() => {
          this.props.clickItem(this.props.imageList[index].url);
        });
      }, 3000);
      this.closeAutoTagView();
    }

    getBoxImg = (box, index) => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.onload = () => {
        const startX = img.width * box.x_start;
        const endX = img.width * box.x_end;
        const width = endX - startX;
        const startY = img.height * box.y_start;
        const endY = img.height * box.y_end;
        const height = endY - startY;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, startX, startY, width, height, 0, 0, canvas.width, canvas.height);
        this.setState({
          boxImgList: {
            ...this.state.boxImgList,
            [index]: canvas.toDataURL()
          }
        })
      }
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = this.props.selectedImage;
    }

    exitFindMode = () => {
      this.props.onChangeBrowserMode('normal');
    }

    findByTag = () => {
      this.props.onChangeBrowserMode('find');
    }

    findByMode = (mode) => {
      this.props.onChangeBrowserMode(mode);
    }

    render() {
        return (
            <div className="flex-box flex-column" style={{justifyContent: 'center', height: '100%'}}>
                {this.state.showSetReasonView && <SetReasonView
                  reasonList={this.state.reasonList}
                  closeView={this.shouldShowSetReasonView}
                  addNewReason={this.addNewReason}
                  deleteReason={this.deleteReason} />}
                <AutoTagView
                  open={this.state.showAutoTagView}
                  closeView={this.closeAutoTagView}
                  index={(this.props.selectedImageNumInAll)}
                  autoTagImages={this.autoTagImages}
                  inferLabel={this.inferLabel} />
                <SearchButton
                    exitFindMode={this.exitFindMode}
                    findByTag={this.findByTag}
                    findByMode={this.findByMode} />
                <TagSelector />
                <ul className="w3-ul w3-hoverable margin-top-5"  style={{overflowY: 'auto', flex: '1', padding: '0px 5px'}}>{
                    this.props.boxList.map((box, index) => (
                        <li onClick={() => this.props.changeBoxIndex(index)} className="w3-hover-green" key={box.x_start + box.y_end} style={{borderStyle: `${this.props.boxIndex === index ? 'dotted' : 'none'}`}}>
                            <div>
                                <span>序号: {index + 1}</span>
                                {box.checked
                                  ? box.checked === 'YES'
                                    ? null
                                    : <i onClick={this.onDeleteBox.bind(this, index)} className="fa fa-times et-tag-button w3-right"></i>
                                  : <i onClick={this.onDeleteBox.bind(this, index)} className="fa fa-times et-tag-button w3-right"></i>}
                            </div>
                            <div>
                                <div className="flex-box" style={{alignItems: 'center', padding: '5px 0px'}}>
                                    <span>标签: </span>
                                    <i onClick={this.props.addNewTagToBox.bind(this, index)} className="fa fa-plus-circle et-tag-button"></i>
                                    <div className="flex-box" style={{overflowX: 'auto', marginLeft: '4px'}}>{
                                        box.tag.map((tag, index2) => (
                                            <div key={tag + index2} className="flex-box" style={{border: '2px solid black', alignItems: 'center', marginLeft: '2px', paddingLeft: '3px', paddingRight: '3px', whiteSpace: 'nowrap'}}>
                                                {tag}
                                                {box.checked
                                                  ? box.checked === 'YES'
                                                    ? null
                                                    : <i onClick={this.props.removeTagFromBox.bind(this, index, index2)} className="fa fa-times et-tag-button"></i>
                                                  : <i onClick={this.props.removeTagFromBox.bind(this, index, index2)} className="fa fa-times et-tag-button"></i>}
                                            </div>
                                        ))
                                    }</div>
                                </div>
                            </div>
                            <div>额外信息:<input className="w3-input" type="text" onChange={this.onChangeBoxInfo.bind(this, index)} value={this.props.boxList[index].info}/></div>
                            <img src={this.state.boxImgList[index]} style={{maxWidth: '100%', marginTop: '5px', maxHeight: '80px'}} alt="tag-content" />
                            {this.props.userLevel > 0 &&
                              <CheckReviewSelector
                                openSetReasonView={this.shouldShowSetReasonView}
                                reasonList={this.state.reasonList}
                                value={box.checked ? box.checked : '' }
                                reason={box.reason ? box.reason : ''}
                                changeReviewState={this.props.changeReviewState}
                                changeReason={this.props.changeReason}
                                index={index}/>}
                            {this.props.userLevel === 0 &&
                              <div>
                                {box.checked
                                  ? box.checked === 'YES'
                                    ? <p style={{color: 'green'}}>审核通过</p>
                                    : <div>
                                      <p style={{color: 'red'}}>审核未通过</p>
                                      <p>{`原因：${box.reason}`}</p>
                                    </div>
                                  : <p style={{color: 'orange'}}>待审核</p>}
                              </div>}
                        </li>
                    ))
                }</ul>
                <div>
                  <div className="flex-box margin-top-5 w3-card">
                      <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                      <input onChange={this.handleAutoTagStart} className="w3-input" type="number" value={this.state.autoTagStart} style={{width: '30%'}}/>
                      <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>标注<br/>数量</span>
                      <input onChange={this.handleAutoTagNum} className="w3-input" type="number" value={this.state.autoTagNum} style={{width: '30%'}}/>
                      <button onClick={this.openAutoTagView} className="w3-button w3-green" style={{width: '30%'}}>自动标注</button>
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

export default TagView
