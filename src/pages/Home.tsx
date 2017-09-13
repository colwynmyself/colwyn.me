import * as React from 'react';

import Block from '../components/generic/Block';
import CodeBox from '../components/CodeBox';

import '../styles/Home.css';

export default function Home() {
    return (
        <div className="home">
            <Block>
                <div className="flex-container">
                    <div className="flex-1 flex-container">
                        <CodeBox />
                    </div>
                    <div className="flex-1 padded">
                        <h3>Me</h3>
                        <p>
                            I'm a self taught web developer based in Portland, Oregon. I spend most of my free time practicing programming by putting myself
                            through the <a href="https://github.com/ossu/computer-science" target="_blank" title="OSSU program">OSSU program</a>, reading comics
                            and history books, and playing video games.
                        </p>
                    </div>
                </div>
            </Block>
        </div>
    );
}