import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import VideoLabel from './VideoLabel';
import ForwardIcon from 'react-icons/lib/md/arrow-forward';
import { addNewVideoLabel, removeVideoLabel } from '../actions/video_action';

const OutContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  margin: 5px 0px;
  align-items: center;
`;

const TopContainer = styled.div`
  height: 5%;
  background: #fafafa;
`;

const ContentContainer = styled.div`
  height: 80%;
  display: flex;
  background: rgb(48, 48, 48);
  padding: 32px 0px;
`;

const VideoContainer = styled.div`
  width: 60%;
  padding: 32px 64px;
`;

const Video = styled.video`
  max-width: 100%;
`;

const OptionsContainer = styled.div`
  width: 40%;
  display: flex;
  color: white;
  padding: 32px 0px;
  flex-direction: column;
  justify-content: flex-start;
`;

const Input = styled.input`
  width: 45px;
`;

const ListContainer = styled.div`
  height: 15%;
  display: flex;
  overflow-x: auto;
  background: rgb(196, 245, 142);
  padding: 10px 10px;
`;

const Title = styled.h6`
  margin: 0;
`;

let video = null;

class VideoView extends Component {
  state = {
    currentTime: 0,
    startMinute: 0,
    startSecond: 0,
    endMinute: 0,
    endSecond: 0,
    tag: '马车'
  }

  componentDidMount() {
      video = document.getElementById('my-video');
      video.addEventListener('timeupdate', () => {
        this.setState({
          currentTime: parseInt(video.currentTime, 10)
        })
      })
      video.addEventListener('durationchange', () => {
        const maxMinute = parseInt(video.duration / 60, 10);
        const maxSecond = parseInt(((video.duration / 60) - maxMinute) * 60, 10);
        this.setState({
          maxMinute,
          maxSecond
        })
      })
  }

  handleTag = (e) => {
    this.setState({
      tag: e.target.value
    })
  }

  handleStartMinute = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value > 59) value = 59;
    if(value < 0) value = 0;
    if(value > this.state.maxMinute) value = this.state.maxMinute;
    this.setState({
      startMinute: value
    }, () => {
      if(this.state.startMinute === this.state.maxMinute) {
        if(this.state.startSecond > this.state.maxSecond) {
          this.setState({
            startSecond: this.state.maxSecond
          })
        }
      }
    })
  }

  handleStartSecond = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value > 59) value = 59;
    if(value < 0) value = 0;
    if(this.state.startMinute === this.state.maxMinute) {
      if(value > this.state.maxSecond) {
        value = this.state.maxSecond
      }
    }
    this.setState({
      startSecond: value
    })
  }

  handleEndMinute = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value > 59) value = 59;
    if(value < 0) value = 0;
      if(value > this.state.maxMinute) value = this.state.maxMinute;
    this.setState({
      endMinute: value
    }, () => {
      if(this.state.endMinute === this.state.maxMinute) {
        if(this.state.endSecond > this.state.maxSecond) {
          this.setState({
            endSecond: this.state.maxSecond
          })
        }
      }
    })
  }

  handleEndSecond = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value > 59) value = 59;
    if(value < 0) value = 0;
    if(this.state.endMinute === this.state.maxMinute) {
      if(value > this.state.maxSecond) {
        value = this.state.maxSecond
      }
    }
    this.setState({
      endSecond: value
    })
  }

  addNewLabel = () => {
    if(this.state.startMinute > this.state.endMinute) {
      window.alert('结束时间不能小于开始时间');
    } else if(this.state.startMinute === this.state.endMinute && this.state.startSecond > this.state.endSecond) {
      window.alert('结束时间不能小于开始时间');
    } else {
      const start = this.state.startMinute * 60 + this.state.startSecond;
      const end = this.state.endMinute * 60 + this.state.endSecond;
      const tag = this.state.tag;
      this.props.dispatch(addNewVideoLabel({
        start,
        end,
        tag
      }))
    }
  }

  goToPoint = (start) => {
    video.currentTime = start;
  }

  removeLabel = (index) => {
    this.props.dispatch(removeVideoLabel(index));
  }

  render() {
    return (
        <OutContainer>
          <TopContainer />
          <ContentContainer>
            <VideoContainer>
              <Video id='my-video' controls src={require('./test.mp4')} type="video/mp4"/>
            </VideoContainer>
            <OptionsContainer>
              <Title>时间轴</Title>
              <Row>
                <Row>
                  <Input value={this.state.startMinute} onChange={this.handleStartMinute} type="number" />
                  <span>:</span>
                  <Input value={this.state.startSecond} onChange={this.handleStartSecond} type="number" />
                </Row>
                <ForwardIcon />
                <Row>
                  <Input value={this.state.endMinute} onChange={this.handleEndMinute} type="number" />
                  <span>:</span>
                  <Input value={this.state.endSecond} onChange={this.handleEndSecond} type="number" />
                </Row>
              </Row>
              <Title>标签</Title>
              <Row>
                <select value={this.state.tag} onChange={this.handleTag} style={{width: '100px', padding: '3px'}}>
                  <option>马车</option>
                  <option>路灯</option>
                  <option>万圣节</option>
                  <option>南瓜</option>
                </select>
              </Row>
              <button className="w3-button w3-green" style={{width: '100px', marginTop: '5px'}} onClick={this.addNewLabel}>添加标签</button>
            </OptionsContainer>
          </ContentContainer>
          <ListContainer>
            {this.props.videoLabelList.map((label, index) => (
              <VideoLabel removeLabel={this.removeLabel} goToPoint={this.goToPoint} key={label.start + label.end + index} index={index} start={label.start} end={label.end} tag={label.tag} />
            ))}
          </ListContainer>
        </OutContainer>
    )
  }
}

const mapStateToProps = ({ videoReducer }) => ({
  videoLabelList: videoReducer.videoLabelList
})

export default connect(mapStateToProps)(VideoView);
