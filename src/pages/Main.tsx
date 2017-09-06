import * as React from 'react';
import { connect } from 'react-redux';

import Terminal from '../components/Terminal';
import * as terminalSelectors from '../selectors/terminal';
import * as terminalActions from '../actions/terminal';

interface MainProps {
    history: {
        id: string;
        line: string;
        response: string;
    }[];
    userInput: string;
    submitLine(userInput: string): void;
    changeUserInput(value: string): void;
}

function Main(props: MainProps) {
    return (
        <Terminal
            userInput={props.userInput}
            submitLine={props.submitLine}
            changeUserInput={props.changeUserInput}
            history={props.history}
        />
    );
}

const mapStateToProps = state => {
    const terminalState = terminalSelectors.getTerminal(state);

    return {
        history: terminalState.history.toJS(),
        userInput: terminalState.userInput,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        submitLine: userInput => {
            dispatch(terminalActions.submitTerminalLine(userInput));
        },
        changeUserInput: value => {
            dispatch(terminalActions.changeTerminalUserInput(value));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main);
