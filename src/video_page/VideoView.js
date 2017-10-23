import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import VideoLabel from './VideoLabel';
import ForwardIcon from 'react-icons/lib/md/arrow-forward';
import { addNewVideoLabel, removeVideoLabel, addNewVideo,
         saveVideoLabel, getVideoLabel, getVideoList,
         initState, deleteVideo, getTagList, changeTagStringList,
         getFileCount, getLabeledFileCount } from '../actions/video_action';
import UploadIcon from 'react-icons/lib/md/movie-filter';
import DeleteVideoIcon from 'react-icons/lib/md/delete';
import TagEditContainer from './TagEditContainer';

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
  flex-wrap: wrap;
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
  flex-shrink: 0;
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
  word-wrap: break-word;
  overflow-y: auto;
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
  word-wrap: break-word;
  overflow-y: auto;
  &:hover {
    cursor: pointer;
  }
`;

const TagContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

let video = null;

class VideoView extends Component {
  state = {
    currentTime: 0,
    startHour: 0,
    startMinute: 0,
    startSecond: 0,
    endHour: 0,
    endMinute: 0,
    endSecond: 0,
    currentIndex: 0,
    firstLoad: true,
    currentListName: '',
    start: 1,
    num: 10
  }

  handleStart = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value < 1) value = 1;
    if(this.props.fileCount) {
      if(value > this.props.fileCount) {
        value = this.props.fileCount
      }
    }
    this.setState({
      start: value
    })
  }

  handleNum = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value < 1) value = 1;
    this.setState({
      num: value
    })
  }

  componentWillMount() {
    this.props.dispatch(getVideoList(1, 10));
    this.props.dispatch(getTagList());
    this.props.dispatch(getFileCount());
    this.props.dispatch(getLabeledFileCount());
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
        const maxHour = parseInt(video.duration / 60 / 60, 10);
        const maxMinute = parseInt(video.duration / 60, 10);
        const maxSecond = parseInt(((video.duration / 60) - maxMinute) * 60, 10);
        this.setState({
          maxHour,
          maxMinute,
          maxSecond
        })
      })
      video.addEventListener('play', () => {
        const time = video.currentTime;
        const hour = parseInt(time / 3600, 10);
        const minute = parseInt(time / 60, 10);
        const second = parseInt(time % 60, 10);
        this.setState({
          startHour: hour,
          startMinute: minute,
          startSecond: second
        })
      })
      video.addEventListener('pause', () => {
        const time = video.currentTime;
        const hour = parseInt(time / 3600, 10);
        const minute = parseInt(time / 60, 10);
        const second = parseInt(time % 60, 10);
        this.setState({
          endHour: hour,
          endMinute: minute,
          endSecond: second
        })
      })
  }

  handleStartHour = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value > 24) value = 24;
    if(value < 0) value = 0;
    if(value > this.state.maxHour) value = this.state.maxHour;
    this.setState({
      startHour: value
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

  handleEndHour = (e) => {
    let value = parseInt(e.target.value, 10);
    if(value > 24) value = 24;
    if(value < 0) value = 0;
      if(value > this.state.maxHour) value = this.state.maxHour;
    this.setState({
      endHour: value
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
    const { startHour, startMinute, startSecond, endHour, endMinute, endSecond } = this.state;
    if(startHour > endHour) {
      window.alert('结束时间不能小于开始时间');
    } else if(startHour === endHour && startMinute > endMinute) {
      window.alert('结束时间不能小于开始时间');
    } else if(startHour === endHour && startMinute === endMinute && startSecond > endSecond) {
      window.alert('结束时间不能小于开始时间');
    } else {
      const start = startHour * 3600 + startMinute * 60 + startSecond;
      const end = endHour * 3600 + endMinute * 60 + endSecond;
      const tagList = [];
      tagList.push(document.getElementById('tag-string-list-select').value);
      this.props.dispatch(addNewVideoLabel({
        start,
        end,
        tagList
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
      this.props.dispatch(saveVideoLabel(videoList[index].name));
    }
  }

  onDeleteVideo = () => {
    this.props.dispatch(deleteVideo(this.state.currentIndex));
    if(this.state.currentIndex !== 0) {
      video.src = this.props.videoList[this.state.currentIndex - 1].url;
      this.setState({
        currentIndex: this.state.currentIndex - 1
      }, () => {
        this.props.dispatch(getVideoLabel(this.props.videoList[this.state.currentIndex].name));
      })
    } else {
      if(this.props.videoList.length === 1) {
        this.props.dispatch(initState());
        video.src = null;
      } else {
        setTimeout(() => {
          video.src = this.props.videoList[0].url;
          this.props.dispatch(getVideoLabel(this.props.videoList[0].name));
        }, 1000)
      }
    }
  }

  changeListName = () => {
    const listName = document.getElementById('list-name-list-select').value;
    this.props.dispatch(changeTagStringList(listName));
  }

  getVideoList = () => {
    this.setState({
      currentIndex: 0
    })
    video.src = null;
    this.props.dispatch(getVideoList(this.state.start, this.state.num));
    setTimeout(() => {
      video.src = this.props.videoList[0].url
    }, 5)
  }

  previousVideoList = () => {
    this.props.dispatch(saveVideoLabel(this.props.videoList[this.state.currentIndex].name, this.props.videoLabelList));
    this.props.dispatch(initState());
    this.setState((state) => {
        state.start = state.start - state.num > 0 ? state.start - state.num : 1;
        state.currentIndex = 0;
    }, () => {
        this.props.dispatch(getVideoList(this.state.start, this.state.num, function(url) {
          video.src = url;
        }));
    });
  }

  nextVideoList = () => {
    const maxValue = this.props.fileCount;
    this.props.dispatch(saveVideoLabel(this.props.videoList[this.state.currentIndex].name, this.props.videoLabelList));
    this.props.dispatch(initState());
    this.setState((state) => {
      state.start = state.start + state.num > maxValue ? maxValue : state.start + state.num;
      state.currentIndex = 0;
    }, () => {
      this.props.dispatch(getVideoList(this.state.start, this.state.num, function(url) {
        video.src = url;
      }));
    })
  }

  render() {
    const { listNameList, tagList, tagStringList } = this.props;
    return (
        <Container>
          <LeftContainer>
            <TopContainer>
              <span style={{marginLeft: '10px'}}>{`标注进度: ${this.props.labeledFileCount}/${this.props.fileCount}`}</span>
              {this.props.videoList.length > 0 && <DeleteVideoIcon onClick={this.onDeleteVideo} className="et-hoverable-black" style={{fontSize: '24px', position: 'absolute', right: '10px', color: '#aaa'}} />}
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
              <Row style={{flexWrap: 'wrap'}}>
                <Row>
                  <Input value={this.state.startHour} onChange={this.handleStartHour} type="number" />
                  <span>:</span>
                  <Input value={this.state.startMinute} onChange={this.handleStartMinute} type="number" />
                  <span>:</span>
                  <Input value={this.state.startSecond} onChange={this.handleStartSecond} type="number" />
                </Row>
                <ForwardIcon style={{flexGrow: '1', fontSize: '20px'}} />
                <Row>
                  <Input value={this.state.endHour} onChange={this.handleEndHour} type="number" />
                  <span>:</span>
                  <Input value={this.state.endMinute} onChange={this.handleEndMinute} type="number" />
                  <span>:</span>
                  <Input value={this.state.endSecond} onChange={this.handleEndSecond} type="number" />
                </Row>
              </Row>
              <TagContainer>
                <select id="list-name-list-select" onChange={this.changeListName} className="w3-select" style={{width: '49%'}}>
                  {listNameList.map((name, index) => (
                    <option key={name + index}>{name}</option>
                  ))}
                </select>
                <select id="tag-string-list-select" className="w3-select" style={{width: '49%'}}>
                  {tagStringList.map((tag, index) => (
                    <option key={tag + index}>{tag}</option>
                  ))}
                </select>
              </TagContainer>
              <button className="w3-button w3-green w3-card" style={{width: '100%', marginTop: '5px'}} onClick={this.addNewLabel}>添加标签</button>
              <TagEditContainer />
            </OptionsContainer>
            <LabelListContainer>
              {this.props.videoLabelList.map((label, index) => (
                <VideoLabel removeLabel={this.removeLabel} goToPoint={this.goToPoint} key={label.start + label.end + index} index={index} start={label.start} end={label.end} tagList={label.tagList} />
              ))}
            </LabelListContainer>
            <div>
              <div className="flex-box margin-top-5" style={{justifyContent: 'space-between'}}>
                  <span style={{padding: '0px 8px 0px 0px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>起始<br/>序号</span>
                  <input onChange={this.handleStart} className="w3-input" type="number" value={this.state.start} style={{width: '25%'}}/>
                  <span style={{padding: '0px 8px', display: 'flex', whiteSpace:'nowrap', alignItems: 'center'}}>每页<br/>数量</span>
                  <input onChange={this.handleNum} className="w3-input" type="number" value={this.state.num} style={{width: '25%'}}/>
                  <button onClick={this.getVideoList} className="w3-button w3-green w3-card" style={{width: '28%', marginLeft: '10px'}}>获取视频</button>
              </div>
              <div className="flex-box margin-top-5" style={{justifyContent: 'space-between'}}>
                  <button style={{width: '49%'}} onClick={this.previousVideoList} className="w3-button w3-green w3-card">上一页</button>
                  <button style={{width: '49%'}} onClick={this.nextVideoList} className="w3-button w3-green w3-card">下一页</button>
              </div>
            </div>
          </RightContainer>
        </Container>
    )
  }
}

const mapStateToProps = ({ videoReducer }) => ({
  labeledFileCount: videoReducer.labeledFileCount,
  fileCount: videoReducer.fileCount,
  videoLabelList: videoReducer.videoLabelList,
  videoList: videoReducer.videoList,
  listNameList: videoReducer.listNameList,
  tagList: videoReducer.tagList,
  tagStringList: videoReducer.tagStringList
})

export default connect(mapStateToProps)(VideoView);
