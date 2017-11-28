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
      <div>
        <RadioGroup
            style={{
              flexDirection: 'row'
            }}
            aria-label="review"
            name="review"
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="NO" control={<Radio />} label="审核不通过" />
            <FormControlLabel value="YES" control={<Radio />} label="审核通过" />
        </RadioGroup>
      </div>
    )
  }
}

export default CheckReviewSelector;
