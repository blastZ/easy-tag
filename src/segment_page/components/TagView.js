import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeStartValue, changeNumValue, getImageList, onClickItem } from '../../actions/app_action';

class TagView extends Component {
    handleStartChange = (e) => {
        const value = e.target.value;
        const maxValue = parseInt(this.props.fileCount, 10);
        let start = 1;
        if(value.trim() === '' || parseInt(value, 10) <= 0) {
            start = 1;
        } else if(parseInt(value, 10) > maxValue) {
            start = maxValue;
        } else {
            start = parseInt(value, 10);
        }
        this.props.changeStartValue(start);
    }

    handleNumChange = (e) => {
        const value = e.target.value;
        let num = 10;
        if(value.trim() === '' || parseInt(value, 10) <= 0) {
            num = 1;
        } else if(parseInt(value, 10) > 20) {
            num = 20;
        } else {
            num = parseInt(value, 10);
        }
        this.props.changeNumValue(num);
    }

    nextImageList = () => {
        this.props.saveSegmentAnnotator(this.props.selectedImageNum);
        this.props.onClickItem(0);
        const maxValue = this.props.fileCount;
        const start = this.props.start + this.props.num > maxValue ? maxValue : this.props.start + this.props.num;
        this.props.changeStartValue(start);
        this.props.getImageList();
        // this.setTimeout(() => {
        //     this.props.getImageAnnotation(0);
        //     this.props.initImageCanvas(this.props.imageList[0]);
        // }, 50);
    }

    previousImageList = () => {
        this.props.saveSegmentAnnotator(this.props.selectedImageNum);
        this.props.onClickItem(0);
        const start = this.props.start - this.props.num < 1 ? 1 : this.props.start - this.props.num;
        this.props.changeStartValue(start);
        this.props.getImageList();
        ////////////////////get first image annotation
    }

    render() {
        return (
            <div className="flex-box flex-column" style={{height: '100%', marginTop: '10px'}}>
                <div className="w3-container">
                    <p style={{margin: '0'}}>标签:</p>
                    <div id="legend" className="legend margin-top-5"></div>
                    <p>
                        <label htmlFor="add-label-input" style={{whiteSpace: 'nowrap'}}>添加:</label>
                        <input id="add-label-input" type="text" className="w3-input margin-top-5"/>
                    </p>
                    <p style={{margin: '0'}}>视图:</p>
                    <div className="flex-box margin-top-5">
                        <div id="image-view-button" className="toggle-button w3-button w3-green">图片</div><br />
                        <div id="boundary-view-button" className="toggle-button w3-button w3-green">边界</div><br />
                        <div id="fill-view-button" className="toggle-button w3-button w3-green">填充</div>
                    </div>
                </div>
                <div style={{position: 'absolute', bottom: '0px'}}>
                    <div className="flex-box margin-top-5 w3-card">
                      <span style={{whiteSpace: 'nowrap', padding: '0px 8px', display: 'flex', alignItems: 'center'}}>区域<br />大小</span>
                      <input className="w3-input" value={this.props.regionSize} onChange={this.props.handleRegionSize} />
                      <button style={{width: '30%'}} className="w3-button w3-green" onClick={this.props.onChangeRegionSize}>确定</button>
                    </div>
                    <div className="flex-box margin-top-5 w3-card">
                        <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                        <input onChange={this.handleStartChange} value={this.props.start} className="w3-input" type="number" style={{width: '30%'}}/>
                        <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>每页<br/>数量</span>
                        <input onChange={this.handleNumChange} value={this.props.num} className="w3-input" type="number" style={{width: '30%'}}/>
                        <button onClick={this.props.getImageList} className="w3-button w3-green" style={{width: '30%'}}>确定</button>
                    </div>
                    <div className="flex-box margin-top-5 w3-card">
                        <button onClick={this.previousImageList} style={{width: '50%'}} className="w3-button w3-green">上一页</button>
                        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                        <button onClick={this.nextImageList} style={{width: '50%'}} className="w3-button w3-green">下一页</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ appReducer }) => ({
    fileCount: appReducer.fileCount,
    start: appReducer.start,
    num: appReducer.num,
    selectedImageNum: appReducer.selectedImageNum
})

const mapDispatchToProps = (dispatch) => ({
    changeStartValue: (start) => dispatch(changeStartValue(start)),
    changeNumValue: (num) => dispatch(changeNumValue(num)),
    getImageList: () => dispatch(getImageList()),
    onClickItem: (index) => dispatch(onClickItem(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(TagView);
