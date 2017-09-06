import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import rootReducer from './reducers/rootReducer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter><App /></BrowserRouter>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
