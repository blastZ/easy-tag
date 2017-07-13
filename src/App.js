import React, { Component } from 'react'
import './css/App.css'
import './css/w3.css'
import $ from 'jquery'
import './css/font-awesome.min.css'
import SelectBar from './SelectBar.js'
import SelectedImage from './SelectedImage.js'
import TagView from './TagView.js'
import FileSaver, { saveAs } from 'file-saver'

class App extends Component {
    state = {
        imageList: [{url: require('./imgs/start.jpg')}],
        tagList: [
            // {x_start: 0, y_start: 0, x_end: 10, y_end: 20, tagString: 'car'}
        ],
        currentTag: '1',
        selectedImageNum: 0
    }
    componentDidMount() {
        const that = this
        $('#file').on('change', function() {
            const files = this.files
            for(const file of files) {
                const reader = new FileReader()
                reader.addEventListener('load', function() {
                    const url = this.result
                    that.setState((state) => {
                        state.imageList = state.imageList.concat([{url: url}])
                    })
                })
                reader.readAsDataURL(file)
            }
        })
    }

    clickItem = (url) => {
        for(let i=0; i<this.state.imageList.length; i++) {
            if(this.state.imageList[i].url === url) {
                this.setState({selectedImageNum: i})
                break
            }
        }
    }

    saveResult = () => {
        let result = ''
        this.state.tagList.map((tag) => {
            const x_start = tag.x_start
            const y_start = tag.y_start
            const x_end = tag.x_end
            const y_end = tag.y_end
            const tagString = tag.tagString
            result = result.concat(`${x_start} `).concat(`${y_start} `).concat(`${x_end} `).concat(`${y_end} `).concat(tagString).concat('\n')
        })
        var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "1.txt");
    }

    addTag = (tag) => {
        this.setState((state) => {
            state.tagList = state.tagList.concat([tag])
        })
    }

    changeTag = () => {
        this.setState({currentTag: $('#mySelect').val()})
    }

    render() {
        return (
            <div className="App" className="flex-box full-height">
                <div className="flex-box flex-column full-height" style={{flex: '1 1 auto'}}>
                    <SelectedImage currentTag={this.state.currentTag} onAddTag={this.addTag} selectedImage={this.state.imageList[this.state.selectedImageNum].url}/>
                    <SelectBar onClickItem={this.clickItem} selectedImageNum={this.state.selectedImageNum} imageList={this.state.imageList}/>
                </div>
                <div style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                    <TagView onChangeTag={this.changeTag} onSaveResult={this.saveResult}/>
                </div>
            </div>
        )
  }
}

export default App
