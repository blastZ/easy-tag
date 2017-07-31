import React, { Component } from 'react'

class TaskPage extends Component {
    render() {
        return (
            <div className="w3-light-grey full-height">
                <div className="w3-orange flex-box" style={{height: '80px', alignItems: 'center', position: 'relative'}}>
                    <div style={{position: 'absolute', left: '15px'}}><h3 className="w3-text-white">USER NAME</h3></div>
                    <div style={{position: 'absolute', right: '32px'}}><i className="fa fa-plus-circle add-task-button" aria-hidden="true"></i></div>
                </div>
                <div className="w3-content w3-padding-64">
                    <table className="w3-table w3-bordered w3-white w3-border w3-card-2">
                        <thead className="w3-green">
                            <tr>
                                <th>ID</th>
                                <th>TASK-NAME</th>
                                <th>TIME</th>
                                <th>PROGRESS</th>
                                <th>STATE</th>
                                <th>TYPE</th>
                                <th>OPTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>TAG IMAGES</td>
                                <td>2017/7/32</td>
                                <td>30%</td>
                                <td>PROCESSING</td>
                                <td>IMAGE PROCESS</td>
                                <td>
                                    <i className="fa fa-tags table-item-button" aria-hidden="true"> TAG</i>
                                    <i className="fa fa-play-circle table-item-button w3-margin-left" aria-hidden="true"> TRAIN</i>
                                    <i className="fa fa-trash table-item-button w3-margin-left" aria-hidden="true"> DELETE</i>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot></tfoot>
                    </table>
                </div>
            </div>
        )
    }
}

export default TaskPage
