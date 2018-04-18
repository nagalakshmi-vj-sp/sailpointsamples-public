import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { config } from "./config";
import App from './App';
import registerServiceWorker from './registerServiceWorker';

document.title = config.title;
ReactDOM.render( config.title, document.getElementById('title'));
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
