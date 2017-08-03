import React, {Component} from 'react'
import ImageView from './ImageView.js'
import ResultView from './ResultView.js'

class Demo extends Component {
    state = {
        resultData: {},
        mode: "GENERAL",
        loading: 'true'
    }

    showResult = (resultData) => {
        this.setState({resultData: resultData, loading: 'false'})
        if(this.state.mode === 'GENERAL') {
            this.drawCanvas()
        }
    }
    //this function will update imageView
    //<!!!!!!!!!!!!!!!!!fix> if request response a long time the image will not show
    drawCanvas() {
        const that = this
        const c = document.getElementById('canvas')
        const ctx = c.getContext('2d')
        const img = document.getElementById('source')
        const theImage = new Image()
        theImage.src = img.src
        theImage.onload = function() {
            let the_width = theImage.width, the_height = theImage.height
            if(the_height > 600) {
                the_width = Math.round(the_width * ( 600 / the_height))
                the_height = 600
            }
            c.width = the_width
            c.height = the_height
            ctx.drawImage(theImage, 0, 0, theImage.width, theImage.height, 0, 0, c.width, c.height)
            that.drawObjects()
        }

    }

    drawObjects() {
        const that = this
        const c = document.getElementById('canvas')
        const objects = this.state.resultData.objects
        console.log(objects);
        if(objects) {
            objects.map(function(object, index) {
                const leftWidth = Math.round(object.x_start * c.width)
                const rightWidth = Math.round(object.x_end * c.width)
                const topWidth = Math.round(object.y_start * c.height)
                const bottomWidth = Math.round(object.y_end * c.height)
                const x = leftWidth
                const y = topWidth
                const width = rightWidth - leftWidth
                const height = bottomWidth - topWidth
                const ctx = c.getContext('2d')
                ctx.lineWidth = 5
                ctx.strokeStyle = '#485667'
                ctx.strokeRect(x, y, width, height)
                ctx.lineWidth = 2
                ctx.strokeStyle = 'white'
                ctx.strokeRect(x, y, width, height)

                ctx.font = '2.5em Sans-serif'
                ctx.lineWidth = 5
                ctx.strokeStyle = '#485667'
                ctx.strokeText((index + 1).toString(), x + 10, y + 40)
                ctx.fillStyle = 'white'
                ctx.fillText((index + 1).toString(), x + 10, y + 40)
            })
        }
    }

    //top changeMode function
    changeMode = (mode) => {
        this.setState((state) => {
            state.loading = 'true'
            state.mode = mode
        })
    }

    clickItem = () => {
        this.setState({loading: 'true'})
    }

    loadImage = () => {
        this.setState({loading: 'true'})
    }

    render() {
        return (
            <div id="demo-view" className="flex-box full-height">
                <ImageView mode={this.state.mode} onLoadingImage={this.loadImage} onClickItem={this.clickItem} onChangeMode={this.changeMode} onShowResult={this.showResult}/>
                <ResultView loading={this.state.loading} mode={this.state.mode} resultData={this.state.resultData}/>
            </div>
        )
    }
}

export default Demo
