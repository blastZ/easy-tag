import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import RemoveIcon from 'react-icons/lib/md/close';
import FocusIcon from 'react-icons/lib/md/center-focus-weak';

const OutContainer = styled.div`
  min-width: 200px;
  height: 112px;
  background: #fbfbfb;
  color: black;
  display: flex;
  flex-direction: column;
  margin: 0 5px;
  border: 2px solid #676767;
  position: relative;
  padding-left: 5px;
  &:hover {
    box-shadow: 2px 2px 25px #aaa;
  }
`;

const TagList = styled.div`
  display: flex;
  margin-top: 5px;
`;

const OptionList = styled.div`
  display: flex;
  position: absolute;
  bottom: 5px;
  font-size: 25px;
  margin-top: 5px;
`;

const Tag = styled.div`
  height: 20px;
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background: black;
  color: white;
  border-radius: 5px;
  line-height: 1;
`;

class VideoLabel extends Component {
  componentDidMount() {

  }

  render() {
    const { index, start, end, tag } = this.props;
    const startMinute = parseInt(start / 60, 10);
    const startSecond = start % 60;
    const endMinute = parseInt(end / 60, 10);
    const endSecond = end % 60;
    return (
        <OutContainer>
          <span style={{fontSize: '18px', paddingTop:'4px'}}>{`${startMinute}:${startSecond < 10 ? `0${startSecond}` : `${startSecond}`} - ${endMinute}:${endSecond < 10 ? `0${endSecond}` : `${endSecond}`}`}</span>
          <TagList>
            <Tag>{tag}</Tag>
          </TagList>
          <OptionList>
            <FocusIcon className="et-hoverable-orange" onClick={() => this.props.goToPoint(start)} />
          </OptionList>
          <RemoveIcon onClick={() => this.props.removeLabel(index)} className="et-hoverable-orange" style={{position: 'absolute', right: '5px', top: '5px', fontSize: '25px'}} />
        </OutContainer>
    )
  }
}

export default VideoLabel;
