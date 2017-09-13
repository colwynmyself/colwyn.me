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
        hidden: boolean;
    }[];
    userInput: string;
    submitLine(userInput: string): void;
    changeUserInput(value: string): void;
    navigateHistory(direction: string): void;
}

function Main(props: MainProps) {
    return (
        <Terminal
            userInput={props.userInput}
            history={props.history}
            submitLine={props.submitLine}
            changeUserInput={props.changeUserInput}
            navigateHistory={props.navigateHistory}
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
        navigateHistory: direction => {
            if (direction === 'previous') {
                dispatch(terminalActions.usePreviousTerminalHistory());
            } else {
                dispatch(terminalActions.useNextTerminalHistory());
            }
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main);
