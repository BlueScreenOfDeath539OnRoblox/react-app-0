import { useState } from 'react';
import './App.css';

function Eagler0() {
    const [opened, setOpened] = useState(false);
    const [inputList, setInputList] = useState([]);

    const listitems = () => {
        const inputs = document.querySelector("#inp").value;
        setInputList(inputs.split(' '));
    };

    return (
        <div className="App">
            <widgetbot
                server="1399876207838756906"
                channel="1399876209395110152"
                width="800"
                height="600"
            ></widgetbot>
            <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
        </div>
    );
}

export default Eagler0;