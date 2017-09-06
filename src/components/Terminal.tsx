import * as React from 'react';

import '../styles/Terminal.css';

import TerminalInput from './TerminalInput';
import TerminalLine from './TerminalLine';

interface Props {
    history: {
        id: string;
        line: string;
    }[];
    userInput: string;
    submitLine(): void;
    changeUserInput(value: string): void;
}

export default function Terminal(props: Props) {
    return (
        <div className="terminal">
            <div className="terminal_area">
                {props.history.map(h => <TerminalLine key={h.id} text={h.line} />)}
                <TerminalInput
                    userInput={props.userInput}
                    submitLine={props.submitLine}
                    changeUserInput={props.changeUserInput}
                />
            </div>
        </div>
    );
}