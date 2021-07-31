import React, { useState, useRef } from 'react';
import sha256 from 'crypto-js/sha256';

const Chat = ({ msgs, setMsgs, name }) => {
  const [newMsg, setNewMsg] = useState('');
  const ref = useRef(null);

  const sendMsg = (event) => {
    event.preventDefault();
    const teste = sha256(newMsg);
    console.log(teste);
    ref.current.value = '';
    setNewMsg('');
  }

  return (
      <>
        <ul>
            { msgs.length > 0 && (
                msgs.map(msg => (<li key={msg}>{msg}</li>))
            )}
        </ul>
        <form onSubmit={(event) => sendMsg(event)}>
            <input type="text" ref={ref} required onChange={(s) => setNewMsg(name+s.target.value)}></input>
        </form>
      </>
   );
};

export default Chat;
