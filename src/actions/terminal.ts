import uuid from 'uuid';

import { apiRequest } from '../utils/request';

export const REQUEST_TERMINAL_RESPONSE = '@@colwyn/REQUEST_TERMINAL_RESPONSE';
const requestTerminalResponse = (id, userInput) => ({
    id,
    userInput,
    type: REQUEST_TERMINAL_RESPONSE,
});

export const TERMINAL_REQUEST_RECEIVED = '@@colwyn/TERMINAL_REQUEST_RECEIVED';
const terminalResponseReceived = (id, response) => ({
    id,
    response,
    type: TERMINAL_REQUEST_RECEIVED,
});

export const TERMINAL_REQUEST_ERROR = '@@colwyn/TERMINAL_REQUEST_ERROR';
const terminalResponseError = (id, error) => ({
    id,
    error,
    type: TERMINAL_REQUEST_ERROR,
});

export const CLEAR_TERMINAL = '@@colwyn/CLEAR_TERMINAL';
const clearTerminal = () => ({
    type: CLEAR_TERMINAL,
});

export const submitTerminalLine = userInput => dispatch => {
    const id = uuid.v4();

    if (userInput.toLowerCase() === 'clear') {
        dispatch(clearTerminal());
    } else {
        dispatch(requestTerminalResponse(id, userInput));

        const data = {
            input: userInput,
        };
        apiRequest('/terminal-input', 'POST', data)
            .then(res => {
                dispatch(terminalResponseReceived(id, res.output));
            })
            .catch(err => {
                dispatch(terminalResponseError(id, err.message));
            });
    }
};

export const CHANGE_TERMINAL_USER_INPUT = '@@colwyn/CHANGE_TERMINAL_USER_INPUT';
export const changeTerminalUserInput = userInput => ({
    userInput,
    type: CHANGE_TERMINAL_USER_INPUT,
});

export const USE_PREVIOUS_TERMINAL_HISTORY = '@@colwyn/USE_PREVIOUS_TERMINAL_HISTORY';
export const usePreviousTerminalHistory = () => ({
    type: USE_PREVIOUS_TERMINAL_HISTORY,
});

export const USE_NEXT_TERMINAL_HISTORY = '@@colwyn/USE_NEXT_TERMINAL_HISTORY';
export const useNextTerminalHistory = () => ({
    type: USE_NEXT_TERMINAL_HISTORY,
});