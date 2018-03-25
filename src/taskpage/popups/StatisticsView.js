import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { getTaskTypeName } from '../../utils/Task';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';

const styles = {
  paper: {
    width: '1400px',
    maxWidth: '100%',
  },
  button: {
    width: 150,
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '5px'
  }
};

class StatisticsView extends Component {
  state = {
    checkedFileCount: 0,
    passedFileCount: 0,
  }

  componentDidMount() {
    this.getCheckedFileCount();
    this.getPassedFileCount();
  }

  getCheckedFileCount = () => {
    const { defaultURL, userName, taskName } = this.props;
    fetch(`${defaultURL}checkedfilecount?usrname=${userName}&taskname=${taskName}`)
      .then((response) => response.text())
      .then((result) => {
        this.setState({
          checkedFileCount: parseInt(result, 10)
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getPassedFileCount = () => {
    const { defaultURL, userName, taskName } = this.props;
    fetch(`${defaultURL}passedfilecount?usrname=${userName}&taskname=${taskName}`)
      .then((response) => response.text())
      .then((result) => {
        this.setState({
          passedFileCount: parseInt(result, 10)
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    const { checkedFileCount, passedFileCount } = this.state;
    const { classes, closeView, statisticsUrl, currentTagProgress, outputTagData } = this.props;
    return (
      <Dialog classes={{
        paper: classes.paper
      }} onClose={closeView} open={true}>
        <DialogTitle>标注统计</DialogTitle>
        <DialogContent>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex'}}>
                <h3>{`总图片数: ${currentTagProgress.split('/')[1]}`}</h3>
                <h3 style={{marginLeft: '20px'}}>{`标注张数: ${currentTagProgress.split('/')[0]}`}</h3>
                <h3 style={{marginLeft: '20px'}}>{`已审核张数: ${checkedFileCount}`}</h3>
                <h3 style={{marginLeft: '20px'}}>{`审核通过张数: ${passedFileCount}`}</h3>
              </div>
              <div style={{overflowX: 'auto'}}>
                <img src={statisticsUrl} />
              </div>
              <Button onClick={outputTagData} color="primary" raised className={classes.button}>
                输出标记数据
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(StatisticsView);
