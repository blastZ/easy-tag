import React, { Component } from 'react'

class TagView extends Component {
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
                    <p style={{display: 'block'}}>Data</p>
                    <div style={{display: 'block'}}>
                        <div id="import-button" className="toggle-button">Import</div><br />
                        <div id="export-button" className="toggle-button">Export</div>
                    </div>
                </div>
                <div style={{position: 'absolute', bottom: '0px'}}>
                    <div className="flex-box margin-top-5 w3-card">
                        <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                        <input className="w3-input" type="number" style={{width: '30%'}}/>
                        <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>每页<br/>数量</span>
                        <input className="w3-input" type="number" style={{width: '30%'}}/>
                        <button className="w3-button w3-green" style={{width: '30%'}}>确定</button>
                    </div>
                    <div className="flex-box margin-top-5 w3-card">
                        <button style={{width: '50%'}} className="w3-button w3-green">上一页</button>
                        <div style={{backgroundColor: 'rgb(211, 204, 204)', width: '2px'}}></div>
                        <button onClick={() => this.props.initImageCanvas(require('../45.png'))} style={{width: '50%'}} className="w3-button w3-green">下一页</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TagView
