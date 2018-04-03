import React, { Component } from 'react';
import TopMenu from './TopMenu';

const ImgTopBar = ({ tagedFileCount, fileCount, index, name, userLevel, deleteSameImage, onDeleteImage, boxList, userName, taskName, setImgList }) => (
  <div style={{width: '100%', position: 'absolute', top: '0', left: '0', zIndex: '10'}}>
    <div style={{position: 'absolute', top: '0', left: '10px', zIndex: '10'}}>
        <p className="w3-text-white">{`标注进度: ${tagedFileCount}/${fileCount}`}</p>
    </div>
    <div style={{position: 'absolute', top: '0', left: '45%', zIndex: '10'}}>
        <p className="w3-text-white">{`第 ${index} 张图片名称: ${name}`}</p>
    </div>
    <TopMenu
      boxList={boxList}
      userName={userName}
      taskName={taskName}
      setImgList={setImgList}
      userLevel={userLevel}
      deleteSameImage={deleteSameImage}
      deleteImage={onDeleteImage} />
  </div>
)

export default ImgTopBar;
