import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { getTaskTypeName } from '../../utils/Task';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';

const styles = {
  button: {
    width: 150,
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '5px'
  }
};

class LoadingStatisticsView extends Component {
  state = {
  }

  componentDidMount() {

  }

  render() {
    const { classes, shouldShowLabelStatisticsLoading } = this.props;
    return (
      <div className="w3-modal" style={{display: 'flex', justifyContent: 'center', paddingTop: '300px'}}>
        <i onClick={shouldShowLabelStatisticsLoading} className="fa fa-times w3-text-white w3-xxlarge et-hoverable" style={{position: 'absolute', top: '10px', right: '10px'}}></i>
        <p style={{fontSize: '4em', color: 'white'}}>统计中...</p>
      </div>
    )
  }
}

export default withStyles(styles)(LoadingStatisticsView);
