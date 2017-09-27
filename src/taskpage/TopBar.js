import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TopBar extends Component {
    render() {
        return (
            <div className="w3-orange flex-box" style={{height: '80px', alignItems: 'center', position: 'relative'}}>
                <div style={{position: 'absolute', left: '15px'}}>
                    <div className="flex-box" style={{justifyContent: 'center', alignItems: 'center'}}>
                        <i onMouseOver={this.props.showPersonPanel} className="fa fa-user-circle-o w3-text-white w3-xxlarge"></i>
                        <h3 className="w3-text-white">&nbsp;{`${this.props.userName} - ${this.props.getUserLevelName}(${this.props.userGroup})`}</h3>
                    </div>
                    {
                        this.props.shouldShowPersonPanel ?
                        <div className="popup" style={{position: 'absolute', left: '-2px', top: '56px'}}>
                            <button onClick={this.props.onLogout}
                                    onMouseOut={this.props.closePersonPanel}
                                    className="w3-button w3-black"
                                    style={{borderRadius: '20px'}}>登出</button>
                        </div>
                        : null
                    }
                </div>
                <div style={{position: 'absolute', right: '15px'}}>
                  <Link to="/helper/0" target="_blank">
                    <i className="fa fa-question-circle-o w3-text-white w3-xxlarge helper-icon" />
                  </Link>
                </div>
            </div>
        )
    }
}

export default TopBar;
