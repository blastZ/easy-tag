import React, { Component } from 'react';
import styled from 'styled-components';
import ImgContainer from './ImgContainer';
import CloseIcon from 'react-icons/lib/md/clear';
import { connect } from 'react-redux';

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background: rgba(0,0,0,0.6);
  z-index: 10000;
  padding: 64px 0px;
  overflow-y: auto;
`;

const InnerContainer = styled.div`
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  padding: 15px;
  resize: none;
  min-width: 800px;
  background: transparent;
  margin-top: 15px;
  color: white;
  border: none;
  outline: none;
`;

class EditView extends Component {
  state = {
    contentList: []
  }

  componentDidMount() {
    const { navList, partIndex, itemIndex } = this.props;
    const contentList = [];
    this.setState({
      contentList: navList[partIndex].partList[itemIndex].contentList
    });
  }

  handlePChange = (index, e) => {
    const value = e.target.value;
    this.setState((state) => {
      state.contentList[index].type === 'img' ? state.contentList[index].name = value : state.contentList[index].content = value;
    })
  }

  saveEditResult = () => {
    this.props.saveEditResult(this.state.contentList);
  }

  render() {
    return (
      <Container>
        <CloseIcon onClick={this.saveEditResult} style={{color: 'white', position: 'fixed', right: '30px', top: '20px', fontSize: '40px'}} />
        <InnerContainer>
          {this.state.contentList.map((content, index) => (
            content.type === 'p'
            ? <TextArea onChange={this.handlePChange.bind(this, index)} key={content.content + index} value={content.content} />
            : content.type === 'a'
              ? <TextArea onChange={this.handlePChange.bind(this, index)} key={content.content + index} value={content.content} />
              : <div key={content.name + index}>
                <img src={content.src} className="w3-image"/>
                { content.name && <TextArea onChange={this.handlePChange.bind(this, index)} className="w3-center" value={content.name} />}
              </div>
          ))}
        </InnerContainer>
      </Container>
    )
  }
}

const mapStateToProps = ({ appReducer }) => ({
  navList: appReducer.navList
})

export default connect(mapStateToProps)(EditView);
