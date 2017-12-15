import React, { Component } from 'react';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';

const styles = {
  button: {
    width: '20px',
    height: '20px',
    minHeight: '0',
    marginTop: '15px',
    marginRight: '10px'
  },
  buttonLabel: {
    width: '20px',
    height: '20px',
  }
}

class CheckReviewSelector extends Component {
  state = {
    value: this.props.value,
    reason: this.props.reason,
  }

  handleChange = (e, value) => {
    this.setState({
      value
    })
    this.props.changeReviewState(value, this.props.index);
  }

  handleReason = (e) => {
    this.setState({
      reason: e.target.value
    }, () => {
      this.props.changeReason(this.state.reason, this.props.index);
    })
  }

  render() {
    const { reasonList, classes, openSetReasonView } = this.props;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{marginRight: '10px'}}>审核</span>
          <RadioGroup
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'no-wrap'
              }}
              aria-label="review"
              name="review"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <FormControlLabel value="YES" control={<Radio />} label="通过" />
              <FormControlLabel value="NO" control={<Radio />} label="不通过" />
          </RadioGroup>
        </div>
        <div>
          {this.state.value === 'NO' && <div style={{display: 'flex', alignItems: 'center'}}>
            <Button onClick={openSetReasonView} fab color="primary" aria-label="add" classes={{
              root: classes.button,
              label: classes.buttonLabel
            }}>
              <AddIcon style={{width: '18px', height: '18px'}} />
            </Button>
            <FormControl style={{flexGrow: 1}}>
              <InputLabel htmlFor="age-simple">审核不通过原因</InputLabel>
              <Select
                value={this.state.reason}
                onChange={this.handleReason}>
                {reasonList.map((reason) => (
                  <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(CheckReviewSelector);
