import * as React from 'react';

import '../styles/Terminal.css';

import TerminalInput from './TerminalInput';
import TerminalLine from './TerminalLine';

interface Props {
    history: {
        id: string;
        line: string;
        response: string;
        hidden: boolean;
    }[];
    userInput: string;
    submitLine(userInput: string): void;
    changeUserInput(value: string): void;
    navigateHistory(direction: string): void;
}

export default function Terminal(props: Props) {
    return (
        <div className="terminal">
            <div className="terminal_area">
                {
                    props.history
                        .filter(h => !h.hidden)
                        .map(h => <TerminalLine key={h.id} text={h.line} response={h.response} />)
                }
                <TerminalInput
                    userInput={props.userInput}
                    submitLine={props.submitLine}
                    changeUserInput={props.changeUserInput}
                    navigateHistory={props.navigateHistory}
                />
            </div>
        </div>
    );
}