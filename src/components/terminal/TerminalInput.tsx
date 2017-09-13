import * as React from 'react';

interface Props {
    userInput: string;
    submitLine(userInput: string): void;
    changeUserInput(value: string): void;
    navigateHistory(direction: string): void;
}

export default function TerminalInput(props: Props) {
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        switch (e.key) {
            case 'Enter': {
                props.submitLine(props.userInput);
                break;
            }
            case 'ArrowUp': {
                props.navigateHistory('previous');
                e.preventDefault();
                break;
            }
            case 'ArrowDown': {
                props.navigateHistory('next');
                e.preventDefault();
                break;
            }
            default: {
                break;
            }
        }
    }

    function handleUserInput(e: React.FormEvent<HTMLInputElement>) {
        props.changeUserInput(e.currentTarget.value);
    }

    return (
        <div className="terminal_input">
            <input type="text" onKeyDown={handleKeyDown} value={props.userInput} onChange={handleUserInput} />
        </div>
    );
}