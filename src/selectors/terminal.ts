import { createSelector } from 'reselect';

const getTerminalState = state => {
    return state.terminal;
};

const getTerminalData = state => {
    const terminalState = getTerminalState(state);

    return {
        history: terminalState.get('history'),
    };
};

export const getTerminal = createSelector(
    [getTerminalData],
    terminal => terminal,
);