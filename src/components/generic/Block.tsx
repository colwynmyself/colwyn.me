import * as React from 'react';

import Container from './Container';

interface Props {
    children?: any;
}

export default function Block(props: Props) {
    return (
        <div className="block">
            <Container>
                {props.children}
            </Container>
        </div>
    );
}