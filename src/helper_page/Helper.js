import React, { Component } from 'react';
import styled from 'styled-components';
import { Switch, Link, Route, withRouter } from 'react-router-dom';
import LeftPageIcon from 'react-icons/lib/fa/angle-left';
import RightPageIcon from 'react-icons/lib/fa/angle-right';
import ImgContainer from './ImgContainer';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: white;
`;

const LeftContainer = styled.div`
  display: flex;
  width: 15%;
  flex-direction: column;
  background: #fafafa;
  overflow-y: scroll;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  align-items: center;
  overflow-y: auto;
  position: relative;
`;

const Content = styled.div`
  max-width: 800px;
  width: 800px;
  margin: 0 auto;
  padding: 20px 15px 40px 15px;
  line-height: 1.7;
  white-space: pre-line;
`;

const NavUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 10px 30px;
  line-height: 2;
  letter-spacing: 1.5px;
`;

const PartUl = styled.ul`
  list-style: none;
  padding-left: 30px;
  line-height: 2;
`;

const SegmentBar = styled.div`
  width: 100%;
  background: #f1f1f1;
  height: 3px;
  margin: 30px 0px;
`;

class Item extends Component {
  changePartIndex = (partIndex) => {
    this.props.changePartIndex(partIndex);
  }

  changeIndex = (partIndex, index) => {
    this.props.changeIndex(partIndex, index);
  }

  render() {
    const {name, partList, partIndex, statePartIndex, stateItemIndex} = this.props;
    return (
      <li>
        <Link className="helper-nav-item" style={{textDecoration: 'none', color: `${partIndex === statePartIndex && stateItemIndex === -1 ? '#008cff' : 'black'}`}} to={`/helper/${partIndex}`} onClick={() => this.changePartIndex(partIndex)}>{`${partIndex + 1}.${name}`}</Link>
        <PartUl>
          {partList.map((title, index) => (
            <li key={title + index}>
              <Link className="helper-nav-item" style={{textDecoration: 'none', color: `${partIndex === statePartIndex && stateItemIndex === index ? '#008cff' : 'black'}`}} to={`/helper/${partIndex}/${index}`} onClick={() => this.changeIndex(partIndex, index)}>{title}</Link>
            </li>
          ))}
        </PartUl>
      </li>
    )
  }
}

class Helper extends Component {
  state = {
    navList: [
      {
        name: '软件介绍',
        contentList: [
          {
            type: 'p',
            content: `码全智能视频图像服务器系统软件集图像标注、图像训练和图像测试等功能于一体。根据用户类型不同，可以分为普通用户、编辑用户、管理用户和超级用户四个拥有不同权限的用户版本。登录网址：`
          },
          {
            type: 'a',
            href: 'http://192.168.0.118:8000/',
            content: 'http://192.168.0.118:8000/'
          },
          {
            type: 'img',
            src: require('../imgs/0_0_0.png'),
            name: '图1-1'
          }
        ],
        partList: []
      },
      {
        name: '任务管理',
        contentList: [
          {
            type: 'p',
            content: '任务管理模块包含：新建任务，删除任务，分发任务，任务训练，查看训练状态和任务测试。系统会根据用户的权限，开放相应的管理权限。'
          }
        ],
        partList: [
          '新建任务',
          '删除任务',
          '分发任务',
          '任务训练',
          '查看训练状态',
          '任务测试',
        ]
      },
      {
        name: '图片标注',
        contentList: [
          {
            type: 'p',
            content: '图片标注模块包含：图片浏览，图片上传和删除，画框标注，图片操作，标签管理和标注统计。系统会根据用户的权限，开放相应的功能。'
          }
        ],
        partList: [
          '图片浏览',
          '图片上传和删除',
          '画框标注',
          '图片操作',
          '标签管理',
          '标注统计'
        ]
      },
      {
        name: '服务器用户管理',
        contentList: [
          {
            type: 'p',
            content: '服务器用户管理模块包含四种用户权限，普通用户，编辑用户，管理用户和超级用户。系统会根据用户的权限，开放相应的功能。'
          }
        ],
        partList: [
          '普通用户权限',
          '编辑用户权限',
          '管理用户权限',
          '超级用户权限'
        ]
      }
    ],
    partIndex: 0,
    itemIndex: -1,
    contentEditable: false
  }

  componentWillUpdate() {
    document.getElementById('right-container').scrollTop = 0;
  }

  changePartIndex = (partIndex) => {
    this.setState({
      partIndex,
      itemIndex: -1
    })
  }

  changeIndex = (partIndex, itemIndex) => {
    this.setState({
      partIndex,
      itemIndex
    })
  }

  nextPage = () => {
    const maxPartIndex = this.state.navList.length - 1;
    const maxItemIndex = this.state.navList[this.state.partIndex].partList.length - 1;

    if(this.state.itemIndex + 1 > maxItemIndex) {
      if(this.state.partIndex + 1 > maxPartIndex) {

      } else {
        this.setState({
          partIndex: this.state.partIndex + 1,
          itemIndex: -1
        }, () => {
          this.props.history.push(`/helper/${this.state.partIndex}/${this.state.itemIndex === -1 ? '' : `${this.state.itemIndex}`}`);
        })
      }
    } else {
      this.setState({
        itemIndex: this.state.itemIndex + 1
      }, () => {
        this.props.history.push(`/helper/${this.state.partIndex}/${this.state.itemIndex === -1 ? '' : `${this.state.itemIndex}`}`);
      })
    }
  }

  prePage = () => {
    if(this.state.itemIndex - 1 < -1) {
      if(this.state.partIndex - 1 < 0) {

      } else {
        this.setState({
          partIndex: this.state.partIndex - 1,
          itemIndex: this.state.navList[this.state.partIndex - 1].partList.length - 1
        }, () => {
          this.props.history.push(`/helper/${this.state.partIndex}/${this.state.itemIndex === -1 ? '' : `${this.state.itemIndex}`}`);
        })
      }
    } else {
      this.setState({
        itemIndex: this.state.itemIndex - 1
      }, () => {
        this.props.history.push(`/helper/${this.state.partIndex}/${this.state.itemIndex === -1 ? '' : `${this.state.itemIndex}`}`);
      })
    }
  }

  shouldContentEditable = () => {
    this.setState({
      contentEditable: !this.state.contentEditable
    })
  }

  render() {
    return (
      <Container>
        <LeftContainer>
          <div style={{borderBottom: '1px solid #e3e3e3', padding: '0px 20px'}}><h5>码全智能视频图像服务器系统软件使用手册(v1.10)</h5></div>
          <NavUl>
            {this.state.navList.map((item, index) => (
              <Item
                changeIndex={this.changeIndex}
                changePartIndex={this.changePartIndex}
                key={item.name + index}
                name={item.name}
                partList={item.partList}
                partIndex={index}
                statePartIndex={this.state.partIndex}
                stateItemIndex={this.state.itemIndex}/>
            ))}
          </NavUl>
        </LeftContainer>
        <RightContainer id="right-container">
          <LeftPageIcon onClick={this.prePage} className="et-helper-left-page-icon" style={{fontSize: '40px', position: 'fixed', left: '18%', top: '50%', color: '#ccc'}}/>
          <RightPageIcon onClick={this.nextPage} className="et-helper-right-page-icon" style={{fontSize: '40px', position: 'fixed', right: '80px', top: '50%', color: '#ccc'}} />
          <Content>
            <Switch>
              {
                this.state.navList.map((nav, index) => (
                  <Route exact path={`/helper/${index}`} render={() => (
                    <div>
                      <h1>{nav.name}</h1>
                      <SegmentBar />
                      {nav.contentList && nav.contentList.map((content) => (
                        content.type === 'p'
                        ? <p>{content.content}</p>
                        : content.type === 'a'
                          ? <a href={content.href}>{content.content}</a>
                          : <ImgContainer src={content.src} name={content.name} />
                      ))}
                    </div>
                  )} />
                ))
              }
              <Route exact path="/helper/1/0" render={() => (
                <div>
                  <h1>{this.state.navList[1].partList[0]}</h1>
                  <SegmentBar />
                  <p>
                    {`管理用户和超级用户支持新建任务，普通用户和编辑用户无此权限。
                      管理用户主界面如图2-1所示。`}
                  </p>
                  <ImgContainer src={require('../imgs/1_0_1.jpg')} name={'图2-1'} />
                  <p>在图2-1中点击新建任务按钮，出现如图2-2界面： </p>
                  <ImgContainer src={require('../imgs/1_0_2.jpg')} name={'图2-2'} />
                  <p>{`创建任务名称时需要先选择任务类型：物体检测、图片分类。物体检测是图像中有多个需要被标注的标注物的任务。而图片分类是图像中只有一种需要被标注的任务。任务类型选择完成并且任务名称输入完成后，点击“添加”，新建任务完成。新建任务会出现在任务表的最后一行，显示该任务的编号、任务名称、创建时间、标注进度、训练进度、任务状态、任务类型和操作。`}</p>
                  <p>超级用户界面如图2-3和2-4所示： </p>
                  <img src={require("../imgs/1_0_3.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-3</p>
                  <img src={require("../imgs/1_0_4.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-4</p>
                  <p>超级用户新建任务的步骤与管理用户新建任务的步骤一样。</p>
                </div>
              )} />
              <Route exact path="/helper/1/1" render={() => (
                <div>
                  <h1>{this.state.navList[1].partList[1]}</h1>
                  <SegmentBar />
                  <p>管理用户和超级用户可以删除任务，普通用户和编辑用户无此权限。
                     管理用户界面如图2-5所示。</p>
                  <img src={require("../imgs/1_1_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-5</p>
                  <p>在任务表部分，对需要删除的任务进行“操作”中的“删除”。点击“删除”后出现图2-6提示框。</p>
                  <img src={require("../imgs/1_1_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-6</p>
                  <p>点击“确定”即完成删除任务。超级用户界面的删除任务步骤与管理用户一致。</p>
                </div>
              )} />
              <Route exact path="/helper/1/2" render={() => (
                <div>
                  <h1>{this.state.navList[1].partList[2]}</h1>
                  <SegmentBar />
                  <p>管理用户和超级用户可以对建立的任务进行分配，配给自己组员，完成图像标注任务。
                     在管理用户界面图2-5中，单击任务名称，出现图2-7界面。</p>
                  <img src={require("../imgs/1_2_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-7</p>
                  <p>图中显示已分配用户和分配任务两部分。分配任务包括了所有小组成员，管理用户和超级用户可以对所在组员进行任务分配。在分配任务列表中选定组内的一个用户，单击分配任务。界面如下图2-8所示：</p>
                  <img src={require("../imgs/1_2_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-8</p>
                  <p>输入给该组员分配的需要标注图片的起始序号和图片数量，点击确定。注意输入的起始序号和图片数量都不能超出本任务中图片总量。在已分配用户中有如图2-9所示。</p>
                  <img src={require("../imgs/1_2_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-9</p>
                  <p>被分配任务的组员用户界面如下图2-10所示</p>
                  <img src={require("../imgs/1_2_3.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-10</p>
                  <p>上图中新任务的任务名称的命名方式是分配任务的用户名_该用户的任务名称_起始序号_图片数量。</p>
                </div>
              )} />
              <Route exact path="/helper/1/3" render={() => (
                <div>
                  <h1>{this.state.navList[1].partList[3]}</h1>
                  <SegmentBar />
                  <p>管理用户和超级用户支持任务训练，即对标注好的任务进行物体检测训练。
                     点击管理用户界面（下图所示）中某一个任务的开启训练（以序号2为例）。</p>
                  <img src={require("../imgs/1_3_0.jpg")} className="w3-image"/>
                  <p>会出现如下图界面所示，需要设置训练时的各个参数。</p>
                  <img src={require("../imgs/1_3_1.jpg")} className="w3-image"/>
                  <p>开启训练后，系统后端安排服务器进行训练，在Worker表会显示进行训练的服务器信息。</p>
                </div>
              )} />
              <Route exact path="/helper/1/4" render={() => (
                <div>
                  <h1>{this.state.navList[1].partList[4]}</h1>
                  <SegmentBar />
                  <p>管理用户和超级用户支持查看状态，可以在物体检测训练中随时查看训练状态图。
                  在管理用户界面中（图2-5）点击查看训练状态后，界面如图2-18所示。</p>
                  <img src={require("../imgs/1_4_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-18</p>
                  <p>上图中显示训练进度和超级用户的“查看训练状态”与管理用户的“查看训练状态”步骤一样。</p>
                </div>
              )} />
              <Route exact path="/helper/1/5" render={() => (
                <div>
                  <h1>{this.state.navList[1].partList[5]}</h1>
                  <SegmentBar />
                  <p>管理用户和超级用户支持任务测试，即可以在物体检测训练完成后上传图片进行测试，得到结果并显示。在管理用户界面点击操作中的测试，界面如图2-19所示</p>
                  <img src={require("../imgs/1_5_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-19</p>
                  <p>点击本界面中的上传测试图片，上传你所需要测试的图片。示例如下图2-20和2-21所示。</p>
                  <img src={require("../imgs/1_5_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-20</p>
                  <img src={require("../imgs/1_5_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图2-21</p>
                  <p>图2-20为上传的原图，图2-21为系统测试结果图。</p>
                </div>
              )} />
              <Route exact path="/helper/2/0" render={() => (
                <div>
                  <h1>{this.state.navList[2].partList[0]}</h1>
                  <SegmentBar />
                  <p>普通用户、编辑用户、管理用户和超级用户都支持图片浏览。图片浏览基本功能包括上一页、下一页、通过起始序号和每页数量进行浏览图片、键盘左右和翻页效果
                  普通用户界面如下图3-1所示：</p>
                  <img src={require("../imgs/2_0_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-1</p>
                  <p>上图是普通用户刚刚注册完登录系统后的界面，待本组的管理用户或超级用户分配任务后，再进入普通用户界面。如图3-2所示：</p>
                  <img src={require("../imgs/2_0_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-2</p>
                  <p>点击上界面中的标注，进入标注界面，普通用户标注界面如图3-3所示：</p>
                  <img src={require("../imgs/2_0_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-3</p>
                  <p>查看下一页图片时，可以在图片预览区域单击右边图片或者直接操作键盘上的右键；查看上一页图片时，可以在图片预览区域单击左边或者直接操作键盘上的左键。
                  在预览设置区域可以设置图片的起始序号和每页数量，现已起始序号8（序号上限为图片总数，下限为1）、每页数量为20为例（每页数量上限为20，下限为1），效果图如下图3-4所示：
                  </p>
                  <img src={require("../imgs/2_0_3.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-4</p>
                  <p>预览设置中的“上一页”表示序号8的图像的前20张，单击上一页时，图片预览区域显示序号1至20的图片。如下图3-5所示：</p>
                  <img src={require("../imgs/2_0_4.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-5</p>
                  <p>在上图的基础上，点击预览设置区域内的“下一页”，图像预览区域应该显示序号28至49的图片，因为本任务总数只有28张，故只显示最后一张图片及序号为28的图片，如下图3-6所示</p>
                  <img src={require("../imgs/2_0_5.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-6</p>
                  <p>预览设置中的“上一页”和“下一页”快捷键是“Page Up”和“Page Down”。编辑用户、管理用户和超级用户的图片浏览与普通用户的步骤一致。</p>
                </div>
              )} />
              <Route exact path="/helper/2/1" render={() => (
                <div>
                  <h1>{this.state.navList[2].partList[1]}</h1>
                  <SegmentBar />
                  <p>编辑用户、管理用户和超级用户支持上传图片和删除图片。
                  编辑用户标注界面如下图3-7所示：
                  </p>
                  <img src={require("../imgs/2_1_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-7</p>
                  <p>点击“删除”，编辑用户删除该图片，并同步到执行本任务的其他用户的标注界面。
                  点击“上传本地图片”，编辑用户可以上传需要标注的图片至本任务中。上传时，需注意，上传图片名称不能为中文，否则会出现“图片命名不符合规则”提示。编辑用户上传完图片后，标注界面如下图3-8所示：</p>
                  <img src={require("../imgs/2_1_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-8</p>
                  <p>上图中发现进度信息未发生改变，并且编辑用户刷新后，并没有新上传照片。原因是图片上传至本任务中后，系统自动为新增图片排序，序号不在本编辑用户被分配的图像之中。本任务的管理用户中有新增图片，如下图3-9所示：</p>
                  <img src={require("../imgs/2_1_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-9</p>
                </div>
              )} />
              <Route exact path="/helper/2/2" render={() => (
                <div>
                  <h1>{this.state.navList[2].partList[2]}</h1>
                  <SegmentBar />
                  <p>普通用户、编辑用户、管理用户和超级用户都支持画框标注。普通用户标注界面如上图3-3所示，先在标签选择区域选择相应标签，本任务中的标签包括行人、车牌、标牌、汽车、自行车和电瓶车。如下图3-10所示：</p>
                  <img src={require("../imgs/2_2_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-10</p>
                  <p>由于当前图片中并无可标注内容，所以开始下一张。首先选中标签“车牌”，然后在图片内容显示区域点击左键框住图片中车牌部分，效果图如下图3-11所示：</p>
                  <img src={require("../imgs/2_2_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-11</p>
                  <p>在标注信息区域可以输入被标注物的其他特征，例如被标注物的颜色、形状等等。在图片内容显示区域只显示标注的序号和标签，不显示额外信息。图片标注过后，点击下一张或者上一张图片时，在图像预览区域会显示已完成，标注进度也会随之变化，效果图如图3-12所示：</p>
                  <img src={require("../imgs/2_2_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-12</p>
                  <p>点击图中的删除画框信息，即删除已标注信息。效果图如图3-13所示。</p>
                  <img src={require("../imgs/2_2_3.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-13</p>
                  <img src={require("../imgs/2_2_4.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-14</p>
                  <p>编辑用户、管理用户和超级用户的画框标注与普通用户一致。</p>
                </div>
              )} />
              <Route exact path="/helper/2/3" render={() => (
                <div>
                  <h1>{this.state.navList[2].partList[3]}</h1>
                  <SegmentBar />
                  <p>普通用户、编辑用户、管理用户和超级用户都支持图片操作。
                  在图3-12普通用户标注界面中，鼠标悬停在图片内容显示区域，滚动鼠标滚轮，向前放大，向后缩小。放大图如下图3-15所示：
                  </p>
                  <img src={require("../imgs/2_3_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-15</p>
                  <p>缩小图如图3-16所示：</p>
                  <img src={require("../imgs/2_3_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-16</p>
                  <p>图片内容显示区域的画框会随着图片的缩放变大变小。
                  鼠标悬停在图片内容显示区域时，按住鼠标右键，可以拖动图片，与删除画框信息图相比，效果如图3-17所示。</p>
                  <img src={require("../imgs/2_3_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-17</p>
                  <p>在图片预览区域双击本图片后还原，单击只是图片还原，画框未还原。
                  编辑用户、管理用户和超级用户的画框标注与普通用户一致。</p>
                </div>
              )} />
              <Route exact path="/helper/2/4" render={() => (
                <div>
                  <h1>{this.state.navList[2].partList[4]}</h1>
                  <SegmentBar />
                  <p>普通用户标签管理界面如下图所示：</p>
                  <img src={require("../imgs/2_4_0.jpg")} className="w3-image"/>
                  <p>其中1区域表示标签组，2区域表示标签库，3区域表示删除本标签，4区域表示添加标签名。
                  区域1和2普通用户无权修改，区域4的操作是先在区域2标签库内选择你需要添加的标签名然后点击区域4内的“添加”，画框1的标签名更改成刚刚添加的标签名，在图片显示区域的画框信息也随之改变。
                  编辑用户标签管理界面如下图所示：</p>
                  <img src={require("../imgs/2_4_1.jpg")} className="w3-image"/>
                  <p>编辑用户相较于普通用户多了区域5编辑标签，即可以编辑区域1标签组和区域2标签库内容。点击“添加新标签组”时的界面如下图所示：</p>
                  <img src={require("../imgs/2_4_2.jpg")} className="w3-image"/>
                  <p>输入新标签组名称，例如：尺寸。区域1内会增加“尺寸”标签组。添加新标签的操作如添加新标签组，只是会在区域2内显示，例如：大、小。同一画框可以拥有不同类别的标签，示例图如下图所示：</p>
                  <img src={require("../imgs/2_4_3.jpg")} className="w3-image"/>
                  <p>上图中“黄牌前”是标签组“plate”下的，“大”是标签组“尺寸”下的，一个标注物拥有多个标签时，即拥有多个特征，可以提高识别率。管理用户的界面如下图所示：</p>
                  <img src={require("../imgs/2_4_4.jpg")} className="w3-image"/>
                  <p>管理用户相较于编辑用户，区域5内新增了“查找当前标签”、“修改当前标签组名”和“修改当前标签名”3个功能。管理用户可以针对不合理的标签组和标签名进行修改。当点击“查找当前标签”时，系统会显示出所有具有该标签的图片，以标签组：尺寸，标签：大为例，结果如图所示：</p>
                  <img src={require("../imgs/2_4_5.jpg")} className="w3-image"/>
                  <p>若是想要返回至普通界面点击“退出查找模式”即可。
                  超级用户的功能与管理用户一致，操作相同。</p>
                </div>
              )} />
              <Route exact path="/helper/2/5" render={() => (
                <div>
                  <h1>{this.state.navList[2].partList[5]}</h1>
                  <SegmentBar />
                  <p>所用用户都支持标标注统计查看，即可以查看标注进度和统计信息。以普通用户为例，在普通用户界面单击操作中的“标注统计”（图3-20）后，本任务的统计结果如图3-21所示</p>
                  <img src={require("../imgs/2_5_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-20</p>
                  <img src={require("../imgs/2_5_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图3-21</p>
                  <p>上图中标注进度和统计信息两部分，标注进度显示本任务的进展情况，统计信息显示本任务中的所有标签名和已标记数量。标记数据可输出。</p>
                </div>
              )} />
              <Route exact path="/helper/3/0" render={() => (
                <div>
                  <h1>{this.state.navList[3].partList[0]}</h1>
                  <SegmentBar />
                  <p>普通用户拥有注册、登录和图片标注中的图片浏览、画框标注、图片操作、标注统计等权限。
                  普通用户注册
                  在用户登录界面点击“立即注册！”</p>
                  <img src={require("../imgs/3_0_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-1</p>
                  <p>注册界面如下图4-2所示：</p>
                  <img src={require("../imgs/3_0_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-2</p>
                  <p>上图中第一行的组别选择根据是每小组的名称进行选择，每组的成员不同，任务不同，不能选错。用户名不能为空且至少包含4个字。密码不能为空且至少6位。邮箱必须填写正确。
                  完成注册后在登录界面图  中输入用户名和密码，点击“登录”即可。图片标注的部分权限见3图片标注中的部分内容。
                  </p>
                </div>
              )} />
              <Route exact path="/helper/3/1" render={() => (
                <div>
                  <h1>{this.state.navList[3].partList[1]}</h1>
                  <SegmentBar />
                  <p>编辑用户拥有登录、图片标注中的所有权限。具体见使用手册第三部分，图片标注部分的内容。</p>
                </div>
              )} />
              <Route exact path="/helper/3/2" render={() => (
                <div>
                  <h1>{this.state.navList[3].partList[2]}</h1>
                  <SegmentBar />
                  <p>管理用户拥有登录、任务管理和图片标注中的所有权限。具体见使用手册第二部分任务管理和第三部分图片标注的相关内容</p>
                </div>
              )} />
              <Route exact path="/helper/3/3" render={() => (
                <div>
                  <h1>{this.state.navList[3].partList[3]}</h1>
                  <SegmentBar />
                  <p>超级用户拥有登录、任务管理和图片标注中的所有权限。并且还可以删除用户、修改用户信息、配置用户密码、添加组、删除组和服务器的拥有者分配。
                  在超级用户界面中的Worker列表下，对服务器可以进行分配</p>
                  <img src={require("../imgs/3_3_0.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-3</p>
                  <p>点击上图4-3中的修改拥有者，修改界面如下图4-4所示：</p>
                  <img src={require("../imgs/3_3_1.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-4</p>
                  <p>删除用户、修改用户信息和配置用户密码可以在超级用户界面的用户管理列表下操作，界面如下图4-5所示：</p>
                  <img src={require("../imgs/3_3_2.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-5</p>
                  <p>点击“删除用户”即可删除多余用户。
                  点击编辑用户，界面如下图4-6所示（以用户名为“aaaa”的用户为例）：</p>
                  <img src={require("../imgs/3_3_3.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-6</p>
                  <p>显示该用户的邮箱，现有权限和组别。超级用户可以对该用户进行权限重新分配、组别重新分类和重置密码操作。
                  添加/删除组可以在超级用户界面的用户列表下操作，如图4-7所示</p>
                  <img src={require("../imgs/3_3_4.jpg")} className="w3-image"/>
                  <p className="w3-center">图4-7</p>
                  <p>点击删除组，在出现的提示框“确定删除该用户组吗？”中点击确定，组名删除，所有组员也随之删除。
                  点击添加组，输入新的组名。新组名会同步到注册界面组别选项和超级用户界面下用户管理中的组别选择中。</p>
                </div>
              )} />
            </Switch>
          </Content>
        </RightContainer>
      </Container>
    )
  }
}

export default withRouter(Helper);
