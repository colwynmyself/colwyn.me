import { request } from '../utils/request';

export const REQUEST_TERMINAL_RESPONSE = '@@colwyn/REQUEST_TERMINAL_RESPONSE';
const requestTerminalResponse = userInput => ({
    userInput,
    type: REQUEST_TERMINAL_RESPONSE,
});

export const TERMINAL_REQUEST_RECEIVED = '@@colwyn/TERMINAL_REQUEST_RECEIVED';
const terminalResponseReceived = response => ({
    response,
    type: TERMINAL_REQUEST_RECEIVED,
});

export const TERMINAL_REQUEST_ERROR = '@@colwyn/TERMINAL_REQUEST_ERROR';
const terminalResponseError = error => ({
    error,
    type: TERMINAL_REQUEST_ERROR,
});

export const submitTerminalLine = userInput => dispatch => {
    dispatch(requestTerminalResponse(userInput));

    const data = {
        input: userInput,
    };
    request('http://localhost:3001/terminal-input', 'POST', data)
        .then(res => {
            dispatch(terminalResponseReceived(res.output));
        })
        .catch(err => {
            dispatch(terminalResponseError(err.message));
        });
};

export const CHANGE_TERMINAL_USER_INPUT = '@@colwyn/CHANGE_TERMINAL_USER_INPUT';
export const changeTerminalUserInput = userInput => ({
    userInput,
    type: CHANGE_TERMINAL_USER_INPUT,
});