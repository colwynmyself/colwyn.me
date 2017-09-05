import { handleActions } from 'redux-actions';

const initialState = {
    lines: ['First line'],
};

export default handleActions({}, initialState);