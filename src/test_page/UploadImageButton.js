import React, { Component } from 'react';

class UploadImageButton extends Component {
  render() {
    return (
      <div style={{position: 'absolute', bottom: '25px', display: 'flex', alignItems: 'center'}}>
          <form>
            <label htmlFor="file" className="w3-green w3-button w3-text-white">
                <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                上 传 本 地 图 片
            </label>
            <input multiple id="file" type="file" style={{display: 'none'}}/>
          </form>
      </div>
    )
  }
}

export default UploadImageButton;
