import React, { Component } from 'react';

class SearchButton extends Component {
  state = {
    showFindView: false
  }

  shouldShowFindView = () => {
    this.setState({
      showFindView: !this.state.showFindView
    }, () => {
      if(this.state.showFindView === false) {
        this.props.exitFindMode();
      }
    })
  }

  render() {
    const { findByTag, findByMode } = this.props;
    return (
      <div>
        {!this.state.showFindView
          ? <button onClick={this.shouldShowFindView} className="w3-button w3-card w3-green" style={{width: '100%'}}>查找模式</button>
          : <div style={{display: 'flex', flexDirection: 'column'}}>
            <button onClick={findByTag} className="w3-button w3-card w3-green">查找当前标签</button>
            <button onClick={() => findByMode('findLabel')} className="w3-button w3-card w3-green margin-top-5">查找已标记图片</button>
            <button onClick={() => findByMode('findNoLabel')} className="w3-button w3-card w3-green margin-top-5">查找未标记图片</button>
            <button onClick={() => findByMode('findReviewed')} className="w3-button w3-card w3-green margin-top-5">查找已审核图片</button>
            <button onClick={() => findByMode('findNoReviewed')} className="w3-button w3-card w3-green margin-top-5">查找未审核图片</button>
            <button onClick={() => findByMode('findPassed')} className="w3-button w3-card w3-green margin-top-5">查找审核通过图片</button>
            <button onClick={() => findByMode('findNoPassed')} className="w3-button w3-card w3-green margin-top-5">查找审核未通过图片</button>
            <button onClick={this.shouldShowFindView} className="w3-button w3-card w3-green margin-top-5">退出查找模式</button>
          </div>}
      </div>
    )
  }
}

export default SearchButton;
