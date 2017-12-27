import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import ResultIcon from 'material-ui-icons/Fullscreen';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

class TagView extends Component {
    state = {
    }

    render() {
        return (
            <div className="flex-box flex-column" style={{justifyContent: 'center', height: '100%'}}>
                <div>
                  <List>
                    <ListItem>
                      <ListItemText primary="测试模式" style={{flex: 'none'}}/>
                      <Select
                        value={this.props.testMode}
                        onChange={this.props.handleTestModeChange}>
                        <MenuItem value={0}>车牌检测与识别</MenuItem>
                        <MenuItem value={1}>公章检测与识别</MenuItem>
                      </Select>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon style={{marginRight: '0'}}>
                        <ResultIcon />
                      </ListItemIcon>
                      <ListItemText primary="测试结果" style={{paddingLeft: '0'}}/>
                    </ListItem>
                  </List>
                </div>
                <Divider />
                <ul className="w3-ul w3-hoverable margin-top-5"  style={{overflowY: 'auto', flex: '1', padding: '0px 5px', marginTop: '10px !important'}}>{
                    this.props.boxList.map((box, index) => (
                        <li onClick={() => this.props.changeBoxIndex(index)} className="w3-hover-green" key={box.x_start + box.y_end} style={{borderStyle: `${this.props.boxIndex === index ? 'dotted' : 'none'}`}}>
                            <div>
                                <span>序号: {index + 1}</span>
                            </div>
                            <div>
                                <div className="flex-box" style={{alignItems: 'center', padding: '5px 0px'}}>
                                    <span>标签: </span>
                                    <div className="flex-box" style={{overflowX: 'auto', marginLeft: '4px'}}>{
                                        box.tag.map((tag, index2) => (
                                            <div key={tag + index2} className="flex-box" style={{border: '2px solid black', alignItems: 'center', marginLeft: '2px', paddingLeft: '3px', paddingRight: '3px', whiteSpace: 'nowrap'}}>
                                                {tag}
                                            </div>
                                        ))
                                    }</div>
                                </div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>额外信息:<p style={{marginLeft: '5px'}}>{this.props.boxList[index].info}</p></div>
                        </li>
                    ))
                }</ul>
            </div>
        )
    }
}

export default TagView
