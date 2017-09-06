import { fromJS, Map } from 'immutable';
import uuid from 'uuid';

import * as terminalActions from '../actions/terminal';

const initialState = fromJS({
    history: [
        createNewHistory('My name is Colwyn.', uuid.v4()),
        createNewHistory(`You can email me at: <a href="mailto:colwyn.myself@gmail.com" title="Email me">colwyn.myself@gmail.com</a> or check out my GitHub: <a href="https://github.com/colwynmyself" target="_blank">https://github.com/colwynmyself</a>`, uuid.v4()),
        createNewHistory('Go ahead and type something! Try "help" or "about"', uuid.v4()),
    ],
    currentHistoryId: null,
    userInput: '',
});

function createNewHistory(line: string, id: string, hidden: boolean = false) {
    return Map({
        id,
        line,
        hidden,
        response: '',
    });
}

export default function terminal(state: any = initialState, action: any) {
    switch (action.type) {
        case terminalActions.CLEAR_TERMINAL: {
            return state.merge({
                history: state.get('history').map(h => h.set('hidden', true)).push(createNewHistory('clear', uuid.v4(), true)),
                userInput: '',
            });
        }

        case terminalActions.USE_PREVIOUS_TERMINAL_HISTORY: {
            const history = state.get('history');
            const historyId = state.get('currentHistoryId');
            const currentIndex = historyId ? history.findIndex(h => h.get('id') === historyId) : history.size;
            const nextIndex = currentIndex - 1;

            if (nextIndex < 0) {
                return state;
            }

            return state.merge({
                currentHistoryId: history.getIn([nextIndex, 'id']),
                userInput: history.getIn([nextIndex, 'line']),
            });
        }

        case terminalActions.USE_NEXT_TERMINAL_HISTORY: {
            const history = state.get('history');
            const historyId = state.get('currentHistoryId');
            const currentIndex = historyId ? history.findIndex(h => h.get('id') === historyId) : history.size;
            const nextIndex = currentIndex + 1;

            if (nextIndex === history.size) {
                return state.merge({
                    currentHistoryId: null,
                    userInput: '',
                });
            } else if (nextIndex > history.size) {
                return state;
            }

            return state.merge({
                currentHistoryId: history.getIn([nextIndex, 'id']),
                userInput: history.getIn([nextIndex, 'line']),
            });
        }

        case terminalActions.REQUEST_TERMINAL_RESPONSE: {
            const history = state.get('history');

            return state.merge({
                userInput: '',
                history: history.push(createNewHistory(state.get('userInput'), action.id)),
                currentHistoryId: null,
            });
        }

        case terminalActions.TERMINAL_REQUEST_RECEIVED: {
            const history = state.get('history');
            const index = history.findIndex(h => h.get('id') === action.id);

            if (index < 0) {
                return state;
            }

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