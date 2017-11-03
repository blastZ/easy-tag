import React, { Component } from 'react';
import MenuIcon from 'react-icons/lib/md/arrow-drop-down';

class TopMenu extends Component {
  state = {
    showMenu: false
  }

  closeMenu = () => {
    this.setState({
      showMenu: false
    })
  }

  showMenu = () => {
    this.setState({
      showMenu: true
    })
  }

  deleteImage = () => {
    this.props.deleteImage();
    this.closeMenu();
  }

  deleteSameImage = () => {
    this.props.deleteSameImage();
    this.closeMenu();
  }

  render() {
    return (
      <div style={{position: 'absolute', top: '0px', right: '11px', zIndex: '100', color: 'white'}}>
        <MenuIcon className="et-hoverable" onMouseEnter={this.showMenu} style={{fontSize: '50px'}} />
        {this.state.showMenu &&
          <div onMouseLeave={this.closeMenu} style={{position: 'absolute', top: '40px', right: '10px', width: '153px'}}>
            {this.props.userLevel > 0 && <div onClick={this.deleteImage} className="w3-button w3-green">删除当前图片</div>}
            <div onClick={this.deleteSameImage} className="w3-button w3-green" style={{borderTop: '1px solid white'}}>删除重复图片</div>
          </div>}
      </div>
    )
  }
}

export default TopMenu;
