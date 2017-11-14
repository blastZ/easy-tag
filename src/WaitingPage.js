import React, { Component } from 'react';
import WaitingIcon from 'react-icons/lib/md/autorenew';

class WaitingPage extends Component {
  render() {
    return (
      <div className="w3-modal" style={{
        zIndex: '1000000000',
        paddingTop: '0',
        display: 'flex',
        justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <WaitingIcon style={{
            fontSize: '10em',
            color: 'white'}}
            className="animation-rotate" />
          <p style={{
            margin: '0',
            fontSize: '1.5em',
            color: 'white'
          }}>{this.props.text}</p>
        </div>
      </div>
    )
  }
}

export default WaitingPage;
