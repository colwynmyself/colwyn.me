import * as React from 'react';
import { connect } from 'react-redux';

import Terminal from '../components/Terminal';

function Main() {
    return (
        <Terminal />
    );
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Main);
