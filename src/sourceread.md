目录结构

目前支持8种任务模式，物体检测，图片分类，语义分割，视频分类，缺陷检测，ReID，特征点检测，OCR识别

其中物体检测，ReID, OCR识别使用的是一套界面
语义分割和缺陷检测也可以使用一套界面
图片分类是特殊的一类物体检测界面
特征点检测
视频分类使用专门针对视频的一类界面

daub_page 缺陷检测
point_page 关键点检测
segment_page 实例分割


App.js 主界面

ImgTopBar.js 标注界面上方的标注进度，图片信息，图片操作
Imgotar.js 标注界面下方的状态信息

TagObjectView.js 右侧框中每个标注框的信息
TagSelector.js 右侧框中标签编辑
