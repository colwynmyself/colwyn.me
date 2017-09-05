import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import { Store, Provider } from 'react-redux';
import { createStore }  from 'redux';

import App from './App';
import './styles/index.css';

import indexReducer from './reducers';
const initialState = {};

const store: Store<any> = createStore(indexReducer, initialState);

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root') as HTMLElement,
);
// registerServiceWorker();
