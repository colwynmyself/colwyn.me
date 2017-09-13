import * as React from 'react';

interface Props {
    navigateTo(url: string): void;
}

import Container from './Container';

import '../../styles/Header.css';

export default function Header(props: Props) {
    function handleLinkClick(e, url: string) {
        e.preventDefault();
        props.navigateTo(url);
    }

    return (
        <div className="header">
            <Container>
                <a className="header_logo" href="/" title="Colwyn Fritze-Moor">Colwyn Fritze-Moor</a>
                <nav className="header_nav">
                    <ul className="header_nav-list">
                        <li className="header_nav-item"><a onClick={e => handleLinkClick(e, '/')} className="header_nav-link" href="/" title="Home">Home</a></li>
                        <li className="header_nav-item"><a onClick={e => handleLinkClick(e, '/terminal')} className="header_nav-link" href="/terminal" title="Terminal">Terminal</a></li>
                    </ul>
                </nav>
            </Container>
        </div>
    );
}