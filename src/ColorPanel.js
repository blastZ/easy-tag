import React, { Component } from 'react';

class ColorPanel extends Component {
    render() {
        return (
            <div className="flex-box" style={{position: 'absolute', top:'13px', right:'60px'}}>
                <button className="color-panel-button" style={{backgroundColor: 'blue'}}></button>
                <button className="color-panel-button" style={{backgroundColor: 'yellow'}}></button>
                <button className="color-panel-button" style={{backgroundColor: 'green'}}></button>
                <button className="color-panel-button" style={{backgroundColor: 'red'}}></button>
                <button className="color-panel-button" style={{backgroundColor: 'black'}}></button>
                <button className="color-panel-button" style={{backgroundColor: 'purple'}}></button>
                <button className="color-panel-button" style={{backgroundColor: 'orange'}}></button>
            </div>
        )
    }
}

export default ColorPanel
