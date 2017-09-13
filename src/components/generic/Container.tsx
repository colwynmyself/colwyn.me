import * as React from 'react';

interface Props {
    children?: any;
}

export default function Container(props: Props) {
    return (
        <div className="container">
            {props.children}
        </div>
    );
}