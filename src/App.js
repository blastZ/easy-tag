import React, { Component } from 'react'
import './css/App.css'
import './css/w3.css'
import $ from 'jquery'
import './css/font-awesome.min.css'
import SelectBar from './SelectBar.js'
import SelectedImage from './SelectedImage.js'
import TagView from './TagView.js'
import { saveAs } from 'file-saver'

class App extends Component {
    state = {
        imageList: [{url: require('./imgs/start.jpg'), name: 'start'}],
        tagList: [
            // {x_start: 0, y_start: 0, x_end: 10, y_end: 20, tagString: 'car'} result format
        ],
        currentTagString: '1',
        currentImageName:'',
        selectedImageNum: 0
    }
    componentDidMount() {
        const that = this
        $('#file').on('change', function() {
            const files = this.files
            for(const file of files) {
                const name = file.name.split('.')[0]
                const reader = new FileReader()
                reader.addEventListener('load', function() {
                    const url = this.result
                    that.setState((state) => {
                        state.imageList = state.imageList.concat([{url: url, name: name}])
                    })
                })
                reader.readAsDataURL(file)
            }
        })
    }

    clickItem = (url) => {
        for(let i=0; i<this.state.imageList.length; i++) {
            if(this.state.imageList[i].url === url) {
                this.setState((state) => {
                    state.selectedImageNum = i
                    state.tagList = []
                })
                this.refs.selectedImage.clearBoxList()
                break
            }
        }
    }

    saveResult = () => {
        // let result = `{length: ${this.state.tagList.length} }`
        // this.state.tagList.map((tag) => {
        //     const x_start = tag.x_start
        //     const y_start = tag.y_start
        //     const x_end = tag.x_end
        //     const y_end = tag.y_end
        //     const tagString = tag.tagString
        //     result = result.concat(`${x_start} `).concat(`${y_start} `).concat(`${x_end} `).concat(`${y_end} `).concat(tagString).concat('\n')
        // })
        const result = `{
            "length": ${this.state.tagList.length},
            "objects": [
                ${this.state.tagList.map((tag) => (
                    `{
                        "x_start": ${tag.x_start},
                        "y_start": ${tag.y_start},
                        "x_end": ${tag.x_end},
                        "y_end": ${tag.y_end},
                        "tag": "${tag.tagString}"
                    }`
                ))}
            ]
        }`

        //var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
        //saveAs(blob, `${this.state.imageList[this.state.selectedImageNum].name}.txt`);
        $.ajax({
            url: 'http://192.168.0.118:8888/api/v1.0',
            type: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: result,
            dataType: 'text/plain',
            success: function(data) {
                console.log(data)
            },
            error: function(data) {
                console.log(data)
            }
        })
    }

    addTag = (tag) => {
        this.setState((state) => {
            state.tagList = state.tagList.concat([tag])
        })
    }

    deleteTag = (index) => {
        this.setState((state) => {
            state.tagList.splice(index, 1)
        })
    }

    changeTagString = () => {
        this.setState({currentTagString: $('#mySelect').val()})
    }

    render() {
        return (
            <div className="App flex-box full-height">
                <div className="flex-box flex-column full-height" style={{flex: '1 1 auto'}}>
                    <SelectedImage ref="selectedImage" currentTagString={this.state.currentTagString} onDeleteTag={this.deleteTag} onAddTag={this.addTag} selectedImage={this.state.imageList[this.state.selectedImageNum].url}/>
                    <SelectBar onClickItem={this.clickItem} selectedImageNum={this.state.selectedImageNum} imageList={this.state.imageList}/>
                </div>
                <div style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                    <TagView onChangeTagString={this.changeTagString} onSaveResult={this.saveResult}/>
                </div>
            </div>
        )
  }
}

export default App
