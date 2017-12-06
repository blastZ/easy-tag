import React, { Component } from 'react';
import { FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

class CheckReviewSelector extends Component {
  state = {
    value: this.props.value
  }

  handleChange = (e, value) => {
    this.setState({
      value
    })
    this.props.changeReviewState(value, this.props.index);
  }

  render() {
    return (
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
    )
  }
}

export default CheckReviewSelector;
