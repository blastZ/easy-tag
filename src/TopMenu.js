import React, { Component } from 'react';
import MenuIcon from 'react-icons/lib/md/arrow-drop-down';
import SearchIcon from 'material-ui-icons/Search';
import { DEFAULT_URL } from './utils/global_config';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button'
import Input, { InputLabel } from 'material-ui/Input';

const styles = {
  button: {
    width: 150,
    background: 'linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))',
    letterSpacing: '5px'
  }
};

class TopMenu extends Component {
  state = {
    defaultURL: DEFAULT_URL,
    showMenu: false,
    showSearchView: false,
    searchName: ''
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

  checkBoxList = (boxList) => {
    let flag = true;
    boxList.map((box) => {
      if(box.checked && box.checked === 'YES') {
        flag = false;
      }
    })
    return flag;
  }

  openSearchView = () => {
    this.setState({
      showSearchView: true
    })
  }

  closeSearchView = () => {
    this.setState({
      showSearchView: false
    })
  }

  searchImg = () => {
    this.closeSearchView();
    fetch(`${this.state.defaultURL}getfile?usrname=${this.props.userName}&taskname=${this.props.taskName}&filename=${this.state.searchName}`)
      .then((response) => (response.json()))
      .then((result) => {
        this.props.setImgList(result);
      })
  }

  handleInput = (e) => {
    this.setState({
      searchName: e.target.value.trim()
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{position: 'absolute', top: '0px', right: '11px', zIndex: '100', color: 'white'}}>
        <Dialog onRequestClose={this.closeSearchView} open={this.state.showSearchView}>
          <DialogTitle>查找图片</DialogTitle>
          <DialogContent>
            <div>
              <Input
                style={{marginLeft: '10px'}}
                placeholder="图片名称"
                value={this.state.searchName}
                onChange={this.handleInput}
                className={classes.input}
                inputProps={{
                  'aria-label': 'Description',
                }}
              />
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
              <Button onClick={this.searchImg} color="primary" raised className={classes.button}>
                查找
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <MenuIcon className="et-hoverable" onMouseEnter={this.showMenu} style={{fontSize: '50px'}} />
        {this.state.showMenu &&
          <div onMouseLeave={this.closeMenu} style={{position: 'absolute', top: '40px', right: '10px', width: '153px'}}>
            {this.props.userLevel > 0 && this.checkBoxList(this.props.boxList) && <div onClick={this.deleteImage} className="w3-button w3-green" style={{width: '100%'}}>删除当前图片</div>}
            <div onClick={this.deleteSameImage} className="w3-button w3-green" style={{borderTop: '1px solid white', width: '100%'}}>删除重复图片</div>
            <div onClick={this.openSearchView} className="w3-button w3-green" style={{borderTop: '1px solid white', width: '100%'}}>查找图片</div>
          </div>}
      </div>
    )
  }
}

export default withStyles(styles)(TopMenu);
