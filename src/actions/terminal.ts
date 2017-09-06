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

export const submitTerminalLine = userInput => dispatch => {
    const id = uuid.v4();

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
};

export const CHANGE_TERMINAL_USER_INPUT = '@@colwyn/CHANGE_TERMINAL_USER_INPUT';
export const changeTerminalUserInput = userInput => ({
    userInput,
    type: CHANGE_TERMINAL_USER_INPUT,
});