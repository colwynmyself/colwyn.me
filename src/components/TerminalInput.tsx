import * as React from 'react';

interface Props {
    userInput: string;
    submitLine(): void;
    changeUserInput(value: string): void;
}

export default function TerminalInput(props: Props) {
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            props.submitLine();
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