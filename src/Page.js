import React, { useState } from 'react';
import ButtonComponent from './ButtonComponent';

function Page() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <header>
                <nav>
                    <img src="./react-logo.png" width="40px" />
                </nav>
            </header>
            <h1>Reasons I'm excited to learn React</h1>
            <ul>
                <li>It's a popular library, so I'll be 
                able to fit in with the cool kids!</li>
                <li>I'm more likely to get a job as a developer
                if I know React</li>
            </ul>
            <footer>
                <small>© 2021 Ziroll development. All rights reserved.</small>
            </footer>
            <div>
                <ButtonComponent handleClick={handleClick} label="Click me" />
                <p>You have clicked the button {count} times.</p>
            </div>
        </div>
    )
}

export default Page;