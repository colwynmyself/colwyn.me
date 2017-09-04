import * as React from 'react';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import Terminal from './components/Terminal';

import './styles/App.css';

export default function App(props: any) {
    return (
        <ConnectedRouter history={props.history}>
            <div className="app">
                <Route path="/" component={Terminal} />
            </div>
        </ConnectedRouter>
    );
}
