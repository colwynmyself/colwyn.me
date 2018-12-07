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
                            I'm a software engineer based in Portland, Oregon. I work primarily on web based backends and on large scale data gathering and analysis. Professionally, Python is my primary language but JavaScript is where I come from. In my spare time I work on learning Rust, playing crosswords and video games, and reading as much as I can about programming.
                        </p>
                    </div>
                </div>
            </Block>
        </div>
    );
}