import { useState } from 'react';
import './App';

function WholeThing({ inputList }) {
  return (
    <ul>
      {inputList.map((input0, index) => (
        <li key={index}>{input0}</li>
      ))}
    </ul>
  );
}

function OtherApp() {
  const [inputList, setInputList] = useState([]);
  const [bg, setBg] = useState("https://gifsec.com/wp-content/uploads/2023/01/minecraft-gif-3.gif");
  const [bgnum, setBgnum] = useState(3);

  const listitems = () => {
    const inputs = document.querySelector("#inp").value;
    setInputList(inputs.split(' '));
  };

  const changeBackground = (e) => {
    const value = e.target.value;
    setBgnum(value);
    setBg(`https://gifsec.com/wp-content/uploads/2023/01/minecraft-gif-${value}.gif`);
  };

  return (
    <div className="App">
      <h1>Some Other Random TESTING SITE</h1>
      <div className='imgcontainer'>
        <img src="https://media.tenor.com/lPsMNpUunr4AAAAd/minecraft-aesthetic-background.gif" alt="Minecraft gif" /><br />
        <div className="mcgifcontainer">
          <img src={bg} alt="Minecraft gif" className="mcgif" /><br />
          <div className='imgcontainer'><h2>{'\u2191'} Minecraft Gifs {'\u2191'}</h2></div>
        </div>
      </div>
      <div className='interactivecontainer'>
        <label for="bgnum">Background Number ({bgnum}): <input type="range" id="bgnum" name="bgnum" placeholder='Background number' min={1} max={20} onChange={changeBackground} /></label><br />
        <input className="neon0" type="text" id="inp" placeholder="1 frog and a pond" /><br />
        <button className="neon0" onClick={listitems}>List items in text (separated by spaces)</button>
        <WholeThing inputList={inputList} />
        <select className="neon0">
          <option className="neon0" value="ishaal">Ishaal</option>
          <option className="neon0" value="hisham">Hisham</option>
        </select>
      </div>
    </div>
  );
}

export default OtherApp;
