import { fromJS, Map } from 'immutable';
import uuid from 'uuid';

import * as terminalActions from '../actions/terminal';

const initialState = fromJS({
    history: [
        createNewHistory('My name is Colwyn.', uuid.v4()),
        createNewHistory(`You can email me at: 
        <a href="mailto:colwyn.myself@gmail.com" title="Email me">colwyn.myself@gmail.com</a> or check out my
        GitHub: <a href="https://github.com/colwynmyself" target="_blank">https://github.com/colwynmyself</a>`, uuid.v4()),
        createNewHistory('Go ahead and type something! Try "help" or "about"', uuid.v4()),
    ],
    userInput: '',
});

function createNewHistory(line: string, id: string) {
    return Map({
        id,
        line,
        response: '',
    });
}

export default function terminal(state: any = initialState, action: any) {
    switch (action.type) {
        case terminalActions.REQUEST_TERMINAL_RESPONSE: {
            const history = state.get('history');

            return state.merge({
                userInput: '',
                history: history.push(createNewHistory(state.get('userInput'), action.id)),
            });
        }

        case terminalActions.TERMINAL_REQUEST_RECEIVED: {
            const history = state.get('history');
            const index = history.findIndex(h => h.get('id') === action.id);

            if (index < 0) return state;

            return state.merge({
                history: history.setIn([index, 'response'], action.response),
            });
        }

        case terminalActions.CHANGE_TERMINAL_USER_INPUT: {
            return state.set('userInput', action.userInput);
        }

        default: return state;
    }
}