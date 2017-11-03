import React, { Component } from 'react';
import LeftIcon from 'react-icons/lib/md/chevron-left';
import RightIcon from 'react-icons/lib/md/chevron-right';
import SearchIcon from 'react-icons/lib/fa/search';
import UrlIcon from 'react-icons/lib/fa/chain';

class UploadImageButton extends Component {
  state = {
    uploadMode: 1,
    showSearchView: false,
    showUrlView: false,
    start: 1,
    num: 10
  }

  handleStartChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value < 1) {
      value = 1;
    }
    this.setState({
      start: value
    })
  }

  handleNumChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value < 1) {
      value = 1;
    }
    this.setState({
      num: value
    })
  }

  shouldShowSearchView = () => {
    this.setState({
      showSearchView: !this.state.showSearchView
    })
  }

  shouldShowUrlView = () => {
    this.setState({
      showUrlView: !this.state.showUrlView
    })
  }

  previousUploadMode = () => {
    this.setState({
      uploadMode: this.state.uploadMode - 1 > 0 ? this.state.uploadMode - 1 : 3
    }, () => {
      if(this.state.uploadMode === 1) {
        this.props.bindFileEvent();
      }
    })
  }

  nextUploadMode = () => {
    this.setState({
      uploadMode: this.state.uploadMode + 1 < 4 ? this.state.uploadMode + 1 : 1
    }, () => {
      if(this.state.uploadMode === 1) {
        this.props.bindFileEvent();
      }
    })
  }

  uploadImgByUrl = () => {
    const { defaultURL, userName, taskName } = this.props;
    const url = document.getElementById('upload-input-url').value.trim();
    fetch(`${defaultURL}uploadurlfile?usrname=${userName}&taskname=${taskName}`, {
      method: 'POST',
      body: JSON.stringify({
        url: url
      })
    }).then((response) => response.text())
      .then((result) => {
        setTimeout(() => {
          this.props.getImageList();
        }, 1000)
      })

    this.shouldShowUrlView();
  }

  uploadImgBySearch = () => {
    const { defaultURL, userName, taskName } = this.props;
    const keyword = document.getElementById('upload-input-search').value.trim();
    const searchEngine = document.getElementById('upload-select-search').value;
    fetch(`${defaultURL}scrapyimg?usrname=${userName}&taskname=${taskName}`, {
      method: 'POST',
      body: JSON.stringify({
        engine: searchEngine,
        keyword: keyword,
        start: this.state.start,
        num: this.state.num
      })
    }).then((response) => response.text())
      .then((result) => {
        setTimeout(() => {
          this.props.getImageList();
        }, 1000)
      })

    this.shouldShowSearchView();
  }

  render() {
    return (
      <div style={{position: 'absolute', bottom: '25px', display: 'flex', alignItems: 'center'}}>
        <LeftIcon onClick={this.previousUploadMode} className="et-hoverable" style={{fontSize: '3em', color: 'white'}}/>
        {this.state.uploadMode === 1 &&
          <form>
            <label htmlFor="file" className="w3-green w3-button w3-text-white">
                <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                上 传 本 地 图 片
            </label>
            <input multiple id="file" type="file" style={{display: 'none'}}/>
          </form>}
        {this.state.uploadMode === 2 ?
          this.state.showUrlView ?
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0'}}>
              <div style={{width: '500px', height: '40px', display: 'flex'}}>
                <input id="upload-input-url" className="w3-input" style={{borderLeft: '1px solid rgb(48, 48, 48)'}}/>
                <button onClick={this.shouldShowUrlView} className="w3-button w3-green" style={{flexShrink: '0', borderLeft: '1px solid rgb(48, 48, 48)'}}>取消</button>
                <button onClick={this.uploadImgByUrl} className="w3-button w3-green" style={{flexShrink: '0', borderLeft: '1px solid rgb(48, 48, 48)'}}>确定</button>
              </div>
            </div> :
            <div onClick={this.shouldShowUrlView} className="w3-button w3-green" style={{width: '175px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <UrlIcon />&nbsp;
              <span>通</span>
              <span>过</span>
              <span>U</span>
              <span>R</span>
              <span>L</span>
              <span>上</span>
              <span>传</span>
            </div> : null}
        {this.state.uploadMode === 3 ?
          this.state.showSearchView ?
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0'}}>
              <div style={{width: '610px', height: '40px', display: 'flex'}}>
                <select id="upload-select-search" className="w3-select" style={{width: '120px', paddingLeft: '15px'}}>
                  <option value="baidu">百度</option>
                  <option value="sougou">搜狗</option>
                </select>
                <input id="upload-input-search" className="w3-input" style={{borderLeft: '1px solid rgb(48, 48, 48)'}}/>
                <input value={this.state.start} onChange={this.handleStartChange} type="number" className="w3-input" style={{borderLeft: '1px solid rgb(48,48,48)', width: '55px'}}/>
                <input value={this.state.num} onChange={this.handleNumChange} type="number" className="w3-input" style={{borderLeft: '1px solid rgb(48, 48, 48)', width: '55px'}}/>
                <button onClick={this.shouldShowSearchView} className="w3-button w3-green" style={{flexShrink: '0', borderLeft: '1px solid rgb(48, 48, 48)'}}>取消</button>
                <button onClick={this.uploadImgBySearch} className="w3-button w3-green" style={{flexShrink: '0', borderLeft: '1px solid rgb(48, 48, 48)'}}>确定</button>
              </div>
            </div> :
            <div onClick={this.shouldShowSearchView} className="w3-button w3-green" style={{width: '175px', display: 'flex', alignItems: 'center'}}>
              <SearchIcon />&nbsp;
              <span>通</span>
              <span>过</span>
              <span>搜</span>
              <span>索</span>
              <span>引</span>
              <span>擎</span>
              <span>爬</span>
              <span>图</span>
            </div> : null}
        <RightIcon onClick={this.nextUploadMode} className="et-hoverable" style={{fontSize: '3em', color: 'white'}} />
      </div>
    )
  }
}

export default UploadImageButton;
