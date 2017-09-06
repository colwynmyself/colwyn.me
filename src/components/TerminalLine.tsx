import * as React from 'react';

interface Props {
    text: string;
    response: string;
}

export default function TerminalLine(props: Props) {
    return (
        <div className="terminal_history">
            <div className="terminal_line" dangerouslySetInnerHTML={{ __html: props.text }} />
            {props.response && (
                <div className="terminal_response" dangerouslySetInnerHTML={{ __html: props.response }} />
            )}
        </div>
    );
}