import * as React from 'react';
import { connect } from 'react-redux';

import Terminal from '../components/Terminal';
import * as terminalSelectors from '../selectors/terminal';

interface MainProps {
    history: string[];
}

function Main(props: MainProps) {
    return (
        <Terminal history={props.history} />
    );
}

const mapStateToProps = state => {
    const terminalState = terminalSelectors.getTerminal(state);

    return {
        history: terminalState.history.toJS(),
    };
};

export default connect(mapStateToProps)(Main);
