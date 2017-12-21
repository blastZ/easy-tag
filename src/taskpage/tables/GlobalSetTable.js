import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTaskStateName, getTaskTypeName } from '../../utils/Task';
import { Link } from 'react-router-dom';
import { DEFAULT_TAGED_NUM, DEFAULT_TAGED_PROGRESS, DEFAULT_TAG_SIZE, setParams } from '../../utils/global_config';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = {
  centerInput: {
    textAlign: 'center'
  },
  root: {
    width: '100%'
  },
  table: {
    width: '100%',
    '& tr th': {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px'
    },
    '& tr td': {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px'
    }
  },
}

class GlobalSetTable extends Component {
  state = {
    tagedNum: DEFAULT_TAGED_NUM,
    tagedProgress: DEFAULT_TAGED_PROGRESS,
    tagSize: DEFAULT_TAG_SIZE
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

  handleTagSize = (e) => {
    let value = e.target.value;
    this.setState({
      tagSize: value
    })
    setParams('DEFAULT_TAG_SIZE', value);
  }

  render() {
    const { userLevel, classes } = this.props;
    return(
      <div>
        {userLevel >=2 && <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">全局训练参数</h3>
        </div>}
        {userLevel >=2 &&
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell style={{borderRight: '1px solid rgba(0, 0, 0, 0.075)', width: '33%'}}>最低图片数量</TableCell>
                  <TableCell><TextField type="number" InputProps={{classes: { input: classes.centerInput }}} value={this.state.tagedNum} onChange={this.handleTagedNum}/></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{borderRight: '1px solid rgba(0, 0, 0, 0.075)', width: '33%'}}>最低标注比例</TableCell>
                  <TableCell><TextField type="number" InputProps={{classes: { input: classes.centerInput }}} value={this.state.tagedProgress} onChange={this.handleTagedProgress} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>}
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">标注参数</h3>
        </div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell style={{borderRight: '1px solid rgba(0, 0, 0, 0.075)', width: '33%'}}>最小检测标注面积</TableCell>
                <TableCell>
                  <TextField type="number" InputProps={{classes: { input: classes.centerInput }}} value={this.state.tagSize} onChange={this.handleTagSize} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <div className="et-margin-top-32" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <h3 className="et-table-title">其它参数</h3>
        </div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell style={{borderRight: '1px solid rgba(0, 0, 0, 0.075)', width: '33%'}}>背景颜色</TableCell>
                <TableCell>gray</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  userLevel: appReducer.userLevel
})

export default withStyles(styles)(connect(mapStateToProps)(GlobalSetTable));
