import { useState } from 'react';
import './App.css';

function addiframe(opened, setOpened) {
  if (!opened) {
    const i = document.createElement('iframe');
    i.style =
      "position:fixed; top:0; left:0%; bottom:0; right:0; width:100%; height:60%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;";
    i.src = "https://brm.io/matter-js/demo/#ragdoll";
    i.id = "ifr";
    const test = document.querySelector('.App');
    test.appendChild(i);
    setOpened(true);
  } else {
    const i = document.querySelector("#ifr");
    i.remove();
    setOpened(false);
  }
}

function WholeThing({ inputList }) {
  return (
    <ul>
      {inputList.map((input0, index) => (
        <li key={index}>{input0}</li>
      ))}
    </ul>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [inputList, setInputList] = useState([]);

  const listitems = () => {
    const inputs = document.querySelector("#inp").value;
    setInputList(inputs.split(' '));
  };

  return (
    <div className="App">
      <h1>Hishams TESTING SITE</h1>
      <div className='imgcontainer'>
        <img src="https://gifsec.com/wp-content/uploads/2023/01/minecraft-gif-20.gif" alt="Minecraft gif" />
      </div>
      <br />
      <div className='interactivecontainer'>
        <input className="neon0" type="text" id="inp" placeholder="funny frogs" /><br />
        <button className="neon0" onClick={() => addiframe(opened, setOpened)}>Open Link</button>
        <button className="neon0">Alert Alert</button>
        <button className="neon0" onClick={listitems}>List items in text (separated by spaces)</button>
        <WholeThing inputList={inputList} />
        <select className="neon0">
          <option className="neon0" value="ishaal">Ishaal</option>
          <option className="neon0" value="hisham">Hisham</option>
        </select>
        <form>
          <label>Name:
            <input type="text" className="neon0" />
          </label>
          <input type="submit" className="neon0" />
        </form>
      </div>
    </div>
  );
}

export default App;
