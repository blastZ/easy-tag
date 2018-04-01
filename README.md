## 1.文件结构
- src
  - actions 相关 **actions**
    - app_action.js 应用相关
    - task_action.js 任务管理界面相关
    - video_action.js 视频标注相关
  - css 可复用 css 资源
  - daub_page **缺陷检测**相关内容
    - daub_action.js actions
    - daub_reducer.js reducer
    - SelectDaubBar.js 左侧下方选择栏
    - SelectedDaubImage.js 左侧中间视图
    - TagDaubView.js 右侧标注区域
  - fonts 早期 awsome-fonts 相关文件（后期移除）
  - helper_page **帮助页面**相关内容
    - EditView.js 编辑界面
    - Helper.js 主界面
    - ImgContainer.js 图片容器
  - imgs 图片资源
  - login_page **登陆页面**相关内容
    - Login.js 登陆主界面
    - RegisterView.js 注册页面
    - RightMenu.js 右边菜单栏（帮助文档，demo 演示）
    - SettingView.js 登陆设置（服务器地址）
  - middlewares **中间件**
    - app_middleware.js 应用中间件
    - task_middleware.js 任务管理的中间件
    - video_middleware.js 视频标注的中间件
  - point_page **特征点标注**相关内容
    - SelectedPointImage.js 左侧中间视图
    - SelectPointBar.js 左侧下方选择栏
    - TagPointView.js 右侧标注区域
  - reducers 相关 **reducers**
    - app_reducer.js 应用相关
    - rootReducer.js rootreducer
    - task_reducer.js 任务管理界面相关
    - video_reducer.js 视频标注相关
  - segment_page **语意分割**相关内容
    - components 子组件
      - SelectBar.js 左侧下方选择栏
      - SelectedImage.js 左侧中间视图
      - TagView.js 右侧标注区域
    - segment.css 可复用 css
    - SegmentView.js 主界面
  - tagPage 标注界面（只包涵审核原因设置的弹窗界面）
    - pupups 弹窗组件
      - SetReasonView.js 审核原因设置界面
  - taskPage **任务管理**界面
    - popups 弹窗组件
      - DistriTaskView.js 任务分配
      - LoadingStatisticsView.js 点击标注统计后的加载界面
      - NewTaskView.js 新建任务
      - StatisticsView.js 标注统计界面
      - TrainSettingView.js 训练设置界面
      - TransferView.js 任务分配界面
    - tables **相关表格**
      - GlobalSetTable.js 参数配置
      - OperationsTable.js 操作日志
      - TaskTable.js 任务列表
      - TrainTaskTable.js 训练任务列表
      - UserGroupTable.js 用户组列表
      - UserManageTable.js 用户管理列表
      - WorkerTable.js WOERKER列表
    - TaskPage.js 主界面
    - TopBar.js 顶部栏（用户名，登出）
  - test_page **测试界面**（任务测试）
    - SelectBar.js 左侧下方选择栏
    - SelectedImage.js 左侧中间视图
    - TagView.js 右侧标注区域
    - Test.js 主界面
    - UploadImageButton.js 上传图片按钮
  - testPageForAll **Demo演示**界面（与测试界面相同）
  - utils 工具文件
    - global_config.js 公共变量设置
    - Task.js 任务类型，用户类型与 id 的对应关系
  - video_page **视频标注**相关内容
    - TagEditContainer.js 标签编辑
    - VideoLabel.js 标签内的小标签名
    - VideoView.js 主界面
  - App.js **应用入口**
  - AutoTagView.js 自动标注
  - CheckReviewSelector.js 右侧标注审核部分
  - ImgTopBar.js 左侧中间视图信息（标注进度，图片名等）
  - index.js 顶层入口
  - registerServiceWorker.js 离线设置
  - SearchButton.js 右侧标注查找图片部分
  - SelectBar.js **物体检测**（SelectBar 左侧下方图片选择栏，SelectedImage 左侧中间试图，TagView 右侧标注区域）
  - SelectedImage.js 
  - SelectedObjectImage.js **图片分类**(与物体检测相同，命名加上Object)
  - TagObjectView.js
  - TagSelector.js
  - TagView.js
  - TopMenu.js 标注界面左侧试图区域右上角选项（删除图片等）
  - UploadImageButton.js 上传按钮
  - WaitingPage.js 加载界面（请求等待界面）

## 2.重构方向

1. css 解决方案

    一开始使用普通 `css`， 之后引入 `styled-component` 。后期又引入了 UI 框架 `material-ui`，其中也内置了 css 解决方案，应改为以下方案之一。
      - 采用 `sass` 代替 `css`
      - 采用 `styled-component`
      - 采用 `meterial-ui` 的解决方案

2. 标注实现

    前期采用 `div` 的形式实现标注框，考虑用单个 `svg` 的 `path` 代替 `div`（实现多边形选择） 。缺陷检测的解决方案应为 `svg`， 而不是 `canvas`。

3. 性能问题

    未对 react 做相关性能优化，采用 `lodash` 对 `shouldComponentUpdate`进行相关渲染检测。
    `eject` CRA 脚手架，定制配置项。

4. 文件结构(组件抽离)

    前期的文件结构混乱，单个组件中包含大量代码。后期文件结构不够统一，应统一采用如下文件结构。
    ```
    - page_one
      - components
      - actions
      - reducer
      - index.js
    ```
    所有的请求应在容器 index.js 中完成，保持 components 中子组件的单一性。

5. HTTP 请求
    
    前期使用了 `xmlhttprequest`， 后期部分改为了基于 `Promise` 的 `fetch` 请求。应对 http 请求进行上层封装来返回 `Promise`。
    ```
    request(url, options) {
      indicator.show()
      options.credentials = 'same-origin'
      return fetch(url, options)
        .then(response => {
          setTimeout(() => indicator.hide(), 300)
          return response.json()
        })
    }

    get(url, params) {
      const newUrl = params ? this.build(url, params) : url
      return this.request(newUrl, {
        method: 'GET',
      })
    }

    post(url, body) {
      let options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      if (body) options.body = JSON.stringify(body)
      return this.request(url, options)
    }
    ```
