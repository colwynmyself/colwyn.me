import { fromJS } from 'immutable';
import uuid from 'uuid';

import * as terminalActions from '../actions/terminal';

const initialState = fromJS({
    history: [
        createNewHistory('My name is Colwyn.'),
        createNewHistory('Here is a piece of history'),
    ],
    userInput: '',
});

function createNewHistory(line: string) {
    return {
        line,
        id: uuid.v4(),
    };
}

export default function terminal(state: any = initialState, action: any) {
    switch (action.type) {
        case terminalActions.REQUEST_TERMINAL_RESPONSE: {
            return state.merge({
                userInput: '',
            });
        }

        case terminalActions.TERMINAL_REQUEST_RECEIVED: {
            const history = state.get('history');

            return state.merge({
                history: history.push(createNewHistory(action.response)),
            });
        }

        case terminalActions.CHANGE_TERMINAL_USER_INPUT: {
            return state.set('userInput', action.userInput);
        }

        default: return state;
    }
}