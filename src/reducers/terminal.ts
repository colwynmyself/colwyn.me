import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

const initialState = fromJS({
    history: ['My name is Colwyn.', 'Here is a piece of history'],
});

export default handleActions({}, initialState);