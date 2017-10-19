import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import VideoLabel from './VideoLabel';
import ForwardIcon from 'react-icons/lib/md/arrow-forward';
import { addNewVideoLabel, removeVideoLabel, addNewVideo,
         saveVideoLabel, getVideoLabel, getVideoList,
         initState, deleteVideo } from '../actions/video_action';
import UploadIcon from 'react-icons/lib/md/movie-filter';
import DeleteVideoIcon from 'react-icons/lib/md/delete';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const LeftContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RightContainer = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
`;

const Row = styled.div`
  display: flex;
  margin: 5px 0px;
  align-items: center;
`;

const TopContainer = styled.div`
  height: 5%;
  background: #fafafa;
  display: flex;
  align-items: center;
  position: relative;
`;

const ContentContainer = styled.div`
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(48, 48, 48);
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
`;

const OptionsContainer = styled.div`
  display: flex;
  margin-bottom: 5px;
  flex-direction: column;
`;

const Input = styled.input`
  width: 45px;
`;

const ListContainer = styled.div`
  height: 10%;
  display: flex;
  overflow-x: auto;
  background: rgb(196, 245, 142);
  padding: 10px 10px;
`;

const LabelListContainer = styled.div`
  height: 60%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-grow: 1;
`;

const Title = styled.h6`
  margin: 0;
`;

const VideoCard = styled.div`
  width: 139px;
  height: 75px;
  background: #48443c;
  color: white;
  opacity: 0.7;
  margin-left: 10px;
  padding: 5px 5px;
  &:hover {
    cursor: pointer;
  }
`;

const VideoCardSelected = styled.div`
  width: 139px;
  height: 75px;
  background: #48443c;
  opacity: 1;
  color: white;
  margin-left: 10px;
  box-shadow: inset 0 0 0 3px hsla(0,0%,98%,.75), 0 0 0 3px #f08f10;
  padding: 5px 5px;
  &:hover {
    cursor: pointer;
  }
`;

let video = null;

class VideoView extends Component {
  state = {
    currentTime: 0,
    startMinute: 0,
    startSecond: 0,
    endMinute: 0,
    endSecond: 0,
    tag: '马车',
    currentIndex: 0,
    firstLoad: true
  }

  componentWillMount() {
    this.props.dispatch(getVideoList());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.videoList.length > 0 && this.state.firstLoad) {
      video.src = nextProps.videoList[0].url;
      this.setState({
        firstLoad: false
      })
    }
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
      video.addEventListener('play', () => {
        const time = video.currentTime;
        const minute = parseInt(time / 60, 10);
        const second = parseInt(time % 60, 10);
        this.setState({
          startMinute: minute,
          startSecond: second
        })
      })
      video.addEventListener('pause', () => {
        const time = video.currentTime;
        const minute = parseInt(time / 60, 10);
        const second = parseInt(time % 60, 10);
        this.setState({
          endMinute: minute,
          endSecond: second
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

  saveAndGetLabel = (index) => {
    const { videoLabelList, videoList } = this.props;
    this.props.dispatch(saveVideoLabel(videoList[this.state.currentIndex].name, videoLabelList));
    this.props.dispatch(getVideoLabel(videoList[index].name));
    this.setState({
      currentIndex: index
    })
  }

  uploadNewVideo = (e) => {
    const files = e.target.files;
    if(files) {
      for(const file of files) {
        const type = file.type;
        const canPlay = video.canPlayType(type);
        if(canPlay === '') {
          window.alert('不支持该视频格式');
        } else {
          this.props.dispatch(addNewVideo(file));
          if(this.props.videoList.length === 0) {
            video.src = URL.createObjectURL(file);
          }
        }
      }
    }
  }

  clickVideoItem = (index) => {
    const { videoList, videoLabelList } = this.props;
    if(index !== this.state.currentIndex) {
      video.src = videoList[index].url;
      this.props.dispatch(saveVideoLabel(videoList[this.state.currentIndex].name, videoLabelList));
      this.props.dispatch(initState());
      this.props.dispatch(getVideoLabel(videoList[index].name));
      this.setState({
        currentIndex: index
      })
    } else {
      this.props.dispatch(saveVideoLabel(index));
    }
  }

  onDeleteVideo = () => {
    //EDIT THINK THE SITUATION OF ZERO
    //label disappear fix it
    this.props.dispatch(deleteVideo(this.state.currentIndex));
    video.src = this.props.videoList[this.state.currentIndex - 1].url;
    this.setState({
      currentIndex: this.state.currentIndex - 1
    })
  }

  render() {
    return (
        <Container>
          <LeftContainer>
            <TopContainer>
              <DeleteVideoIcon onClick={this.onDeleteVideo} className="et-hoverable-black" style={{fontSize: '24px', position: 'absolute', right: '10px', color: '#aaa'}} />
            </TopContainer>
            <ContentContainer>
              <VideoContainer>
                <Video id='my-video' controls autoplay type="video/mp4"/>
              </VideoContainer>
              <label className="w3-button w3-green" htmlFor="video-file-input" style={{marginTop: '10px', width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <UploadIcon style={{fontSize: '22px'}} />&nbsp;上 传 本 地 视 频
              </label>
              <input multiple onChange={this.uploadNewVideo} id="video-file-input" type="file" style={{display: 'none'}}/>
            </ContentContainer>
            <ListContainer>
              {this.props.videoList.map((video, index) => (
                index === this.state.currentIndex
                ? <VideoCardSelected key={video.name + index} onClick={() => this.clickVideoItem(index)}>{video.name}</VideoCardSelected>
                : <VideoCard key={video.name + index} onClick={() => this.clickVideoItem(index)}>{video.name}</VideoCard>
              ))}
            </ListContainer>
          </LeftContainer>
          <RightContainer>
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
            <LabelListContainer>
              {this.props.videoLabelList.map((label, index) => (
                <VideoLabel removeLabel={this.removeLabel} goToPoint={this.goToPoint} key={label.start + label.end + index} index={index} start={label.start} end={label.end} tag={label.tag} />
              ))}
            </LabelListContainer>
          </RightContainer>
        </Container>
    )
  }
}

const mapStateToProps = ({ videoReducer }) => ({
  videoLabelList: videoReducer.videoLabelList,
  videoList: videoReducer.videoList
})

export default connect(mapStateToProps)(VideoView);
