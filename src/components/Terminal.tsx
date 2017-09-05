import * as React from 'react';

import '../styles/Terminal.css';

import TerminalInput from './TerminalInput';
import TerminalLine from './TerminalLine';

interface Props {
    history: string[];
}

export default function Terminal(props: Props) {
    return (
        <div className="terminal">
            <div className="terminal_area">
                {props.history.map(h => <TerminalLine key={h} text={h} />)}
                <TerminalInput />
            </div>
        </div>
    );
}