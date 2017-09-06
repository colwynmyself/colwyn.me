import * as React from 'react';

interface Props {
    userInput: string;
    submitLine(userInput: string): void;
    changeUserInput(value: string): void;
}

export default function TerminalInput(props: Props) {
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            props.submitLine(props.userInput);
        }
    }

    function handleUserInput(e: React.FormEvent<HTMLInputElement>) {
        props.changeUserInput(e.currentTarget.value);
    }

    return (
        <div className="terminal_input">
            <input type="text" onKeyPress={handleKeyPress} value={props.userInput} onChange={handleUserInput} />
        </div>
    );
}