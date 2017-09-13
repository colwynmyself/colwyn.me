import { createSelector } from 'reselect';

const getTerminalState = state => {
    return state.get('terminal');
};

const getTerminalData = state => {
    const terminalState = getTerminalState(state);

    return {
        history: terminalState.get('history'),
        userInput: terminalState.get('userInput'),
    };
};

export const getTerminal = createSelector(
    [getTerminalData],
    terminal => terminal,
);