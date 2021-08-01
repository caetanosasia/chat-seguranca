import React, { useState, useRef } from 'react';
import { pbkdf2 } from 'crypto-js';
import  SHA256 from 'crypto-js/sha256';
import AES from 'crypto-js/aes';
import CTR from 'crypto-js/mode-ctr';
import NoPadding from 'crypto-js/pad-zeropadding';
import Hex from 'crypto-js/enc-hex';
import UTF8 from 'crypto-js/enc-utf8';

const key = Hex.parse("000102030405060708090a0b0c0d0e0f");
const iv = Hex.parse("101112131415161718191a1b1c1d1e1f");

const Chat = ({ msgs, setMsgs, name }) => {
  const [newMsg, setNewMsg] = useState('');
  const ref = useRef(null);

  const sendMsg = (event) => {
    event.preventDefault();
    const msg = {};
    msg.encrypted = encrypt(newMsg);
    msg.macMsg = SHA256(msg.encrypted.toString(), key);
    setMsgs([...msgs, msg]);
    ref.current.value = '';
    setNewMsg('');
  }

  const encrypt = (msg) => {
    // encrypt
    return AES.encrypt(msg, key, {
      mode: CTR,
      iv: iv,
      padding: NoPadding
    });
  };

  const decipher = (msg) => {
    const newMac = SHA256(msg.encrypted.toString(), key);
    if(JSON.stringify(newMac.words) !== JSON.stringify(msg.macMsg.words)) return 'Erro na mensagem';
    const decryptedData = AES.decrypt(msg.encrypted, key, {
      mode: CTR,
      iv: iv,
      padding: NoPadding
    });
    return decryptedData.toString(UTF8);
  }

  return (
      <>
        <ul>
            { msgs.length > 0 && (
                msgs.map(msg => (<li key={decipher(msg)+Math.random()}>{decipher(msg)}</li>))
            )}
        </ul>
        <form onSubmit={(event) => sendMsg(event)}>
            <input type="text" ref={ref} required onChange={(s) => setNewMsg(name+s.target.value)}></input>
        </form>
      </>
   );
};

export default Chat;
