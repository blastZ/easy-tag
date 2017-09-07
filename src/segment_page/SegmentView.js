import React, { Component } from 'react';
import './segment.css';
import SelectedImage from './components/SelectedImage';
import SelectBar from './components/SelectBar';
import TagView from './components/TagView';
import { connect } from 'react-redux';
import { addNewSegmentAnnotator } from '../actions/app_action';

var count = 1;

class SegmentView extends Component {
    componentDidMount() {
    }

    initImageCanvas = (imgURL) => {
        const that = this;
        new window.SLICSegmentAnnotator(imgURL, {
            regionSize: 40,
            container: document.getElementById('annotator-container'),
            // annotation: 'annotation.png' // optional existing annotation data.
            labels: [
                {name: 'background', color: [255, 255, 255]},
                'skin',
                'skirt',
                'belt'
            ],
            onload: function() {
              if(count === 1) {
                  count++;
                  initializeLegend(this);
                  initializeLegendAdd(this);
                  initializeButtons(this);
              } else {
              }
            }
        });
      // Create a legend.
      function initializeLegend(annotator) {
        // Attach a click event to a legend item.
        function attachClickEvent(item, i) {
          item.addEventListener('click', function() {
            var selected = document.getElementsByClassName('legend-selected')[0];
            if (selected)
              selected.classList.remove('legend-selected');
            annotator.setCurrentLabel(i);
            this.classList.add('legend-selected');
          });
        }
        var labels = annotator.getLabels();
        var legend = document.getElementById('legend');
        legend.innerHTML = '';
        for (var i = 0; i < labels.length; ++i) {
          // Create an item.
          var color = labels[i].color;
          var colorbox = document.createElement('span');
          colorbox.classList.add('legend-color-box');
          colorbox.style.backgroundColor =
              'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
          var item = document.createElement('div');
          item.classList.add('legend-item');
          item.appendChild(colorbox);
          item.innerHTML += (' ' + labels[i].name);
          legend.appendChild(item);
          attachClickEvent(item, i);
          // Create a delete button.
          if (i !== 0) {
            var deleteButton = document.createElement('div');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('legend-delete-button');
            legend.appendChild(deleteButton);
            attachDeleteEvent(annotator, deleteButton, i);
          }
          legend.appendChild(document.createElement('br'));
        }
        var currentIndex = Math.min(1, labels.length - 1);
        document.getElementsByClassName('legend-item')[currentIndex].click();
      }
      // Attach a click event to a delete button.
      function attachDeleteEvent(annotator, button, index) {
        button.addEventListener('click', function() {
          annotator.removeLabel(index);
          initializeLegend(annotator);
        });
      }
      // Add an item to the legend.
      function initializeLegendAdd(annotator) {
        var input = document.getElementById('add-label-input');
        input.addEventListener('keyup', function(event) {
          if (event.keyCode === 13) {
            var newLabels = annotator.getLabels();
            // Drop colors except the first.
            for (var i = 1; i < newLabels.length; ++i)
              newLabels[i] = newLabels[i].name;
            newLabels.push(event.target.value);
            annotator.setLabels(newLabels);
            initializeLegend(annotator);
            event.target.value = '';
            var index = newLabels.length - 1;
            document.getElementsByClassName('legend-item')[index].click();
          }
        });
      }
      // Create a slide radio input.
      function createToggleButton(button, disableCallback, enableCallback) {
        var enabled = true;
        button.addEventListener('click', function() {
          if (enabled) {
            disableCallback();
            button.classList.add('toggle-button-disabled');
            enabled = !enabled;
          }
          else {
            enableCallback();
            button.classList.remove('toggle-button-disabled');
            enabled = !enabled;
          }
        });
      }
      // Create a local file input.
      function createFileInput(button, callback) {
        var input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(input);
        input.addEventListener('change', function(event) {
          callback(event.target.files[0]);
        });
        button.addEventListener('click', function() {
          input.click();
        });
      }
      // Download as a file.
      function downloadAsFile(url, filename) {
        var anchor = document.createElement('a');
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', filename);
        anchor.click();
        document.body.removeChild(anchor);
      };
      // Attach button events.
      function initializeButtons(annotator) {
        var fillAlpha = 128;
        var boundaryEnabled = true;
        createToggleButton(document.getElementById('image-view-button'),
                           function() { annotator.setImageAlpha(0); },
                           function() { annotator.setImageAlpha(255); });
        createToggleButton(document.getElementById('boundary-view-button'), function() {
          annotator.setBoundaryAlpha(fillAlpha);
          boundaryEnabled = !boundaryEnabled;
        }, function() {
          if (fillAlpha === 128)
            annotator.setBoundaryAlpha(192);
          boundaryEnabled = !boundaryEnabled;
        });
        createToggleButton(document.getElementById('fill-view-button'), function() {
          fillAlpha = 0;
          annotator.setFillAlpha(fillAlpha);
          annotator.setBoundaryAlpha(fillAlpha);
        }, function() {
          fillAlpha = 128;
          annotator.setFillAlpha(fillAlpha);
          if (boundaryEnabled)
            annotator.setBoundaryAlpha(192);
          else
            annotator.setBoundaryAlpha(fillAlpha);
        });
        // Set up json importer.
        createFileInput(document.getElementById('import-button'), function(file) {
            console.log(file);
            console.log(file.type);
          {
            var reader = new FileReader();
            reader.onload = function(event) {
              var data = JSON.parse(event.target.result);
              annotator.setLabels(data.labels);
              annotator.setAnnotation(data.annotation);
              initializeLegend(annotator);
            };
            reader.readAsText(file);
          }
        });
        document.getElementById('export-button').addEventListener('click', function() {
          var data = {
            labels: annotator.getLabels(),
            annotation: annotator.getAnnotation()
          };
          var dataURL = 'data:application/json;charset=utf-8,' +
                        encodeURIComponent(JSON.stringify(data));
          downloadAsFile(dataURL, 'export.json');
        });
      }
    }

    render() {
        return (
            <div className="flex-box full-height">
                <div className="flex-box flex-column full-height" style={{flex: '1 1 auto', width: '80%'}}>
                    <SelectedImage/>
                    <SelectBar
                        initImageCanvas={this.initImageCanvas}
                        saveSegmentAnnotator={this.saveSegmentAnnotator}/>
                </div>
                <div className="flex-box flex-column" style={{width: '20%', backgroundColor: '#F0F0F0'}}>
                    <TagView initImageCanvas={this.initImageCanvas}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ appReducer }) => ({
    segmentAnnotatorList: appReducer.segmentAnnotatorList,
    selectedImageNum: appReducer.selectedImageNum
})

const mapDispatchToProps = (dispatch) => ({
    addNewSegmentAnnotator: (segmentAnnotator) => dispatch(addNewSegmentAnnotator(segmentAnnotator))
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentView);
