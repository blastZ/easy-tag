import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { getTaskTypeName } from '../../utils/Task';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import { FormControl, FormHelperText, FormControlLabel  } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';

const styles = {
  button: {
    width: '48%',
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '1px'
  },
  formControl: {
    width: '100%',
  },
  textField: {
    width: '100%',
    marginTop: '15px'
  }
};

class TrainSettingView extends Component {
  state = {
    structureList: [],
    structure: '',
    epoch: '',
    optimizerList: [],
    optimizer: '',
    batchSize: '',
    learningRate: '',
    weightDecay: '',
    momentum: '',
    verifyRate: 5,
    retrain: false,
    pretrainmodelList: [],
    pretrainmodel: ''
  }

  componentWillMount() {
    // this.resetTrainParmas();
    if(this.props.taskType === 0) {
      this.getDetstructureList();
    } else if(this.props.taskType === 1) {
      this.getClsstructureList();
    }
    this.getOptimizerList();
  }

  getTrainParams = () => {
    fetch(`${this.props.defaultURL}gettrainparams?usrname=${this.props.userName}&taskname=${this.props.currentTaskName}`)
      .then((response) => response.json())
      .then((result) => {
        if(Object.keys(result).length > 2) {
          this.setState({
            structure: result.structure,
            epoch: result.epoch,
            optimizer: result.optimizer,
            batchSize: result.batchsize,
            learningRate: parseFloat(result.learningrate, 10),
            weightDecay: result.weightdecay,
            momentum: result.momentum,
            retrain: result.Retrain === 0 ? false : true,
            verifyRate: result.trainvalratio ? result.trainvalratio : 5
          }, () => {
            if(this.state.retrain) {
              this.getPretrainmodelList(this.state.structure);
              this.setState({
                pretrainmodel: result.pretrainmodel ? result.pretrainmodel : ''
              })
            }
          })
        } else {
          this.getDefaultTrainParams(this.state.structure);
        }
      })
  }

  getDetstructureList = () => {
    fetch(`${this.props.defaultURL}getdetstructure`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          structureList: result,
          structure: result[0]
        }, () => {
          this.getTrainParams();
        })
      })
  }

  getClsstructureList = () => {
    fetch(`${this.props.defaultURL}getclsstructure`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          structureList: result,
          structure: result[0]
        }, () => {
          this.getTrainParams();
        })
      })
  }

  getDefaultTrainParams = (structure) => {
    fetch(`${this.props.defaultURL}getdefaulttrainparams?usrname=${this.props.userName}&taskname=${this.props.currentTaskName}&structure=${structure}`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
            structure: result.structure,
            epoch: result.epoch,
            optimizer: result.optimizer,
            batchSize: result.batchsize,
            learningRate: parseFloat(result.learningrate, 10),
            weightDecay: result.weightdecay,
            momentum: result.momentum,
            retrain: result.Retrain === 0 ? false : true,
            verifyRate: result.trainvalratio ? result.trainvalratio : 5
        }, () => {
          if(this.state.retrain) {
            this.getPretrainmodelList(this.state.structure);
            this.setState({
              pretrainmodel: result.pretrainmodel ? result.pretrainmodel : ''
            })
          }
        })
      })
  }

  getOptimizerList = () => {
    fetch(`${this.props.defaultURL}getoptmethod`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({optimizerList: result})
      })
  }

  getPretrainmodelList = (structure) => {
    fetch(`${this.props.defaultURL}getpretrainmodel?usrname=${this.props.userName}&taskname=${this.props.currentTaskName}&structure=${structure}`)
      .then((response) => (response.json()))
      .then((result) => {
        this.setState({
          pretrainmodelList: result
        })
      })
  }

  // resetTrainParmas = () => {
  //   if(this.props.taskType === 0) {
  //     this.setState({
  //       structure: '',
  //       epoch: 5000,
  //       optimizer: '',
  //       batchSize: 32,
  //       learningRate: 0.0001,
  //       weightDecay: 0.0005,
  //       momentum: 0.9,
  //       verifyRate: 5,
  //       retrain: false,
  //       pretrainmodel: ''
  //     })
  //   } else if(this.props.taskType === 1) {
  //     this.setState({
  //       structure: '',
  //       epoch: 200,
  //       optimizer: '',
  //       batchSize: 64,
  //       learningRate: 0.05,
  //       weightDecay: 0.0005,
  //       momentum: 0.9,
  //       verifyRate: 5,
  //       retrain: false,
  //       pretrainmodel: ''
  //     })
  //   }
  // }

  handleStructure = (e) => {
    this.setState({
      structure: e.target.value
    }, () => {
      if(this.state.structure !== '') {
        this.getDefaultTrainParams(this.state.structure);
        if(this.state.retrain) {
          this.getPretrainmodelList(this.state.structure);
        }
      }
    })
  }

  handleEpoch = (e) => {
    let value = e.target.value;
    if(value < 0) value = 0;
    this.setState({
      epoch: value
    })
  }

  handleOptimizer = (e) => {
    this.setState({
      optimizer: e.target.value
    })
  }

  handleBatchSize = (e) => {
    this.setState({
      batchSize: e.target.value
    })
  }

  handleLearningRate = (e) => {
    this.setState({
      learningRate: e.target.value
    })
  }

  handleWeightDecay = (e) => {
    this.setState({
      weightDecay: e.target.value
    })
  }

  handleMomentum = (e) => {
    this.setState({
      momentum: e.target.value
    })
  }

  handleVerifyRate = (e) => {
    let value = e.target.value;
    if(value < 1) value = 1;
    if(value > 10) value = 10;
    this.setState({
      verifyRate: value
    })
  }

  handleRetrain = (e) => {
    this.setState({
      retrain: e.target.checked
    }, () => {
      if(this.state.retrain) {
        if(this.state.structure !== '') {
          this.getPretrainmodelList(this.state.structure);
        }
      }
    })
  }

  startTrain = () => {
    const { structure, epoch, optimizer, batchSize, learningRate, weightDecay, momentum, verifyRate, retrain, pretrainmodel } = this.state;
    const trainParams = {
      structure,
      epoch,
      optimizer,
      batchsize: parseFloat(batchSize, 10),
      learningrate: learningRate,
      weightdecay: weightDecay,
      momentum,
      trainvalratio: verifyRate,
      Retrain: retrain ? 1 : 0
    }
    if(this.state.reatrain) {
      trainParams.push({
        pretrainmodel
      })
    }
    this.props.startTrain(trainParams);
  }

  render() {
    const { classes, closeView, open } = this.props;
    return (
      <Dialog onRequestClose={closeView} open={open}>
        <DialogTitle>设置训练参数</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel>网络结构</InputLabel>
            <Select
              value={this.state.structure}
              onChange={this.handleStructure}>
              {this.state.structureList.length === 0 && <MenuItem value="">
                <em>None</em>
              </MenuItem>}
              {this.state.structureList.map((structure) => (
                <MenuItem key={structure} value={`${structure}`}>{structure}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="迭代次数"
            value={this.state.epoch}
            onChange={this.handleEpoch}
            className={classes.textField}
          />
          <FormControl className={classes.formControl} style={{marginTop: '15px'}}>
            <InputLabel>optimizer</InputLabel>
            <Select
              value={this.state.optimizer}
              onChange={this.handleOptimizer}>
              {this.state.optimizerList.length === 0 && <MenuItem value="">
                <em>None</em>
              </MenuItem>}
              {this.state.optimizerList.map((optimizer) => (
                <MenuItem key={optimizer} value={`${optimizer}`}>{optimizer}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="batch size"
            value={this.state.batchSize}
            onChange={this.handleBatchSize}
            className={classes.textField}
          />
          <TextField
            label="learning rate"
            className={classes.textField}
            type="number"
            value={this.state.learningRate}
            onChange={this.handleLearningRate}
          />
          <TextField
            label="weight decay"
            className={classes.textField}
            type="number"
            value={this.state.weightDecay}
            onChange={this.handleWeightDecay}
          />
          <TextField
            label="momentum"
            className={classes.textField}
            type="number"
            value={this.state.momentum}
            onChange={this.handleMomentum}
          />
          <TextField
            label="训练验证数据比率"
            className={classes.textField}
            type="number"
            value={this.state.verifyRate}
            onChange={this.handleVerifyRate}
          />
          <FormControlLabel
            style={{marginTop: '15px'}}
            control={
              <Checkbox
                checked={this.state.retrain}
                onChange={this.handleRetrain}
              />
            }
            label="Retrain"
          />
          {this.state.retrain && <FormControl className={classes.formControl}>
              <InputLabel>pretrainmodel</InputLabel>
              <Select
                value={this.state.pretrainmodel}
                onChange={this.handlePretrainmodel}>
                {this.state.pretrainmodelList.length === 0 && <MenuItem value="">
                  <em>None</em>
                </MenuItem>}
                {this.state.pretrainmodelList.map((pretrainmodel) => (
                  <MenuItem key={pretrainmodel} value={`${pretrainmodel}`}>{pretrainmodel}</MenuItem>
                ))}
              </Select>
            </FormControl>}
            <div style={{marginTop: '15px', display: 'flex', justifyContent: 'center'}}>
              <Button onClick={this.startTrain} color="primary" raised className={classes.button}>
                开始训练
              </Button>
            </div>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  defaultURL: appReducer.defaultURL,
  userName: appReducer.userName,
  userLevel: appReducer.userLevel,
  password: appReducer.password
})

export default withStyles(styles)(connect(mapStateToProps)(TrainSettingView));
