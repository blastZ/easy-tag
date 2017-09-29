import React, {Component} from 'react';
import { connect } from 'react-redux';
import { addNewImage, uploadImageFiles, deleteImage } from '../../actions/app_action';
import $ from 'jquery';

class SelectedImage extends Component {
    componentDidMount() {
        const that = this;
        $('#file').on('change', function() {
            const files = this.files;
            let result = true;
            for(const file of files) {
                if((/^[a-zA-Z0-9\-\_\.\u4e00-\u9fa5]+$/).test(file.name) === false) {
                    result = false;
                }
            }
            if(result) {
                for(const file of files) {
                    //decide the file is a image or not
                    if(file.type === 'image/jpeg' || file.type === 'image/png') {
                        const name = file.name;
                        const reader = new FileReader()
                        reader.onload = function() {
                            const url = this.result;
                            that.props.addNewImage(url, name);
                        }
                        reader.readAsDataURL(file);
                    }
                }
                that.props.uploadImageFiles(files);
            } else {
                window.alert('图片命名不符合规则');
            }
        })
    }

    render() {
        const { imageList, selectedImageNum } = this.props;
        return (
            <div className="w3-center w3-padding-24 flex-box full-width" style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', flex: '1'}}>
                <div>
                    <div style={{position: 'absolute', top: '0', left: '10px'}}>
                        <p className="w3-text-white">{`标注进度: ${this.props.taggedFileCount}/${this.props.fileCount}`}</p>
                    </div>
                    <div style={{position: 'absolute', top: '0', left: '45%'}}>
                        <p className="w3-text-white">{`第 1 张 图片名称:${imageList && imageList.length > 0 ? imageList[selectedImageNum].name : 'None'}`}</p>
                    </div>
                    {
                        this.props.userLevel !== 0 ?
                        <i onClick={this.props.deleteImage} className="fa fa-times delete-button-white" aria-hidden="true" style={{position: 'absolute', top: '10px', right: '20px'}}></i>
                        : null
                    }
                </div>
                <div style={{width: '1100px', height: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div id="annotator-container" style={{position: 'relative'}}></div>
                </div>
                {
                    this.props.userLevel !== 0 ?
                    <form style={{position: 'absolute', bottom: '25px'}}>
                        <label htmlFor="file" className="w3-green w3-button w3-text-white">
                            <i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;
                            上 传 本 地 图 片
                        </label>
                        <input multiple id="file" type="file" style={{display: 'none'}}/>
                    </form>
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps = ({ appReducer }) => ({
    userLevel: appReducer.userLevel,
    imageList: appReducer.imageList,
    selectedImageNum: appReducer.selectedImageNum,
    fileCount: appReducer.fileCount,
    taggedFileCount: appReducer.taggedFileCount
})

const mapDispatchToProps = (dispatch) => ({
    addNewImage: (url, name) => dispatch(addNewImage(url, name)),
    uploadImageFiles: (files) => dispatch(uploadImageFiles(files)),
    deleteImage: () => dispatch(deleteImage())
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectedImage);
