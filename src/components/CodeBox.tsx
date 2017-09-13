import * as React from 'react';
import uuid from 'uuid';

import '../styles/CodeBox.css';

const NUMBER_OF_LINES: number = 7;
const MINIMUM_WIDTH: number = 60;
const MAXIMUM_WIDTH: number = 100;

const codeLines: { width: number, id: string }[] = [];
for (let i = 0; i < NUMBER_OF_LINES; i++) {
    const width: number = Math.floor(Math.random() * (MAXIMUM_WIDTH - MINIMUM_WIDTH) + MINIMUM_WIDTH);
    codeLines.push({
        width,
        id: uuid.v4(),
    });
}

export default function CodeBox() {
    return (
        <div className="codebox">
            {codeLines.map(l => <div key={l.id} className="codebox_line" style={{ width: l.width + '%' }} />)}
        </div>
    );
}