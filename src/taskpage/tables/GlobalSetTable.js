import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';
import { DEFAULT_TAGED_NUM, DEFAULT_TAGED_PROGRESS, setParams } from '../../utils/global_config';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

const styles = {
  centerInput: {
    textAlign: 'center'
  }
}

class GlobalSetTable extends Component {
  state = {
    tagedNum: DEFAULT_TAGED_NUM,
    tagedProgress: DEFAULT_TAGED_PROGRESS
  }

  handleTagedNum = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value < 1) {
      value = 1;
    }
    if(isNaN(value)) {
      value = 1;
    }
    this.setState({
      tagedNum: value
    })
    setParams('taged-num', value);
  }

  handleTagedProgress = (e) => {
    let value = parseFloat(e.target.value, 10);
    this.setState({
      tagedProgress: value
    })
    setParams('taged-progress', value);
  }

  render() {
    const { userLevel, classes } = this.props;
    return(
      <div>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">全局参数配置</h3>
        </div>
        <table ref="theTaskTable" className="w3-table w3-bordered w3-white w3-border w3-card-2 w3-centered">
            <thead className="w3-green">
                <tr>
                  <th>开启训练张数</th>
                  <th>开启训练比例</th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td><TextField type="number" InputProps={{classes: { input: classes.centerInput }}} value={this.state.tagedNum} onChange={this.handleTagedNum}/></td>
                <td><TextField type="number" InputProps={{classes: { input: classes.centerInput }}} value={this.state.tagedProgress} onChange={this.handleTagedProgress} /></td>
              </tr>
            </tbody>
            <tfoot></tfoot>
        </table>
      </div>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default withStyles(styles)(connect(mapStateToProps)(GlobalSetTable));
