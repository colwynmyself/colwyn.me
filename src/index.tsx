import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Store, Provider } from 'react-redux';
import { createStore, applyMiddleware, compose }  from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';

const history = createHistory();
const historyMiddleware = routerMiddleware(history);

import indexReducer from './reducers';
import App from './App';

import './styles/index.css';

const store: Store<any> = createStore(
    combineReducers({
        ...indexReducer,
        routing: routerReducer,
    }),
    compose(
        applyMiddleware(thunk),
        applyMiddleware(historyMiddleware),
    ),
);

ReactDOM.render(
    <Provider store={store}><App history={history} /></Provider>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
