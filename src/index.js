import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import TaskPage from './TaskPage'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
