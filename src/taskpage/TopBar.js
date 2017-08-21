import React, { Component } from 'react';

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
            </div>
        )
    }
}

export default TopBar;
