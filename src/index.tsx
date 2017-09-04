import * as React from 'react';
import * as ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose }  from 'redux';
import { combineReducers } from 'redux-immutable';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'remote-redux-devtools';

const history = createHistory();
const middleware = routerMiddleware(history);

import indexReducer from './reducers';

const store = createStore(
    combineReducers({
        ...indexReducer,
        routing: routerReducer,
    }),
    compose(
        applyMiddleware(thunkMiddleware),
        composeWithDevTools(),
    ),
    applyMiddleware(middleware),
);

ReactDOM.render(
    <Provider store={store}><App history={history} /></Provider>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
