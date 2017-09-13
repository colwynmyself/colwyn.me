import * as React from 'react';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import Header from './containers/components/Header';
import Home from './pages/Home';
import Terminal from './pages/Terminal';

import './styles/App.css';

interface Props {
    history: any;
}

export default function App(props: Props) {
    return (
        <ConnectedRouter history={props.history}>
            <div style={{ width: '100%' }}>
                <Route path="/" component={Header} />
                <Route exact path="/" component={Home} />
                <Route exact path="/terminal" component={Terminal} />
            </div>
        </ConnectedRouter>
    );

}
