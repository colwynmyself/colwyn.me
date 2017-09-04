import * as React from 'react';

interface Props {
    text: String;
}

export default function TerminalLine(props: Props) {
    return (
        <div className="terminal_line">
            {props.text}
        </div>
    );
}