import React, { Component } from 'react'

class TagView extends Component {
    render() {
        return (
            <div className="flex-box flex-column" style={{height: '100%'}}>
                <div style={{paddingLeft: '64px'}}>
                    <p>Labels</p>
                    <div id="legend" className="legend"></div>
                    <p>
                        <label htmlFor="add-label-input">Add:</label>
                        <input id="add-label-input" type="text" style={{width: '6em'}} />
                    </p>
                    <p>Views</p>
                    <div>
                        <div id="image-view-button" className="toggle-button">Image</div><br />
                        <div id="boundary-view-button" className="toggle-button">Boundary</div><br />
                        <div id="fill-view-button" className="toggle-button">Fill</div>
                    </div>
                    <p>Data</p>
                    <div>
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
