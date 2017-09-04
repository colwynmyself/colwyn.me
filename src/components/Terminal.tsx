import * as React from 'react';

import '../styles/Terminal.css';

import TerminalInput from './TerminalInput';
import TerminalLine from './TerminalLine';

export default class Terminal extends React.Component {
    render() {
        return (
            <div className="terminal">
                <div className="terminal_area">
                    <TerminalLine text="My name is Colwyn" />
                    <TerminalInput />
                </div>
            </div>
        );
    }
}