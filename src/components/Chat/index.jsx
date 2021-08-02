import React, { useRef } from 'react';
import CryptoJS from 'crypto-js';
import Pbkdf2 from 'crypto-js/pbkdf2';
import  SHA256 from 'crypto-js/sha256';
import AES from 'crypto-js/aes';
import CTR from 'crypto-js/mode-ctr';
import NoPadding from 'crypto-js/pad-zeropadding';
import Hex from 'crypto-js/enc-hex';
import _ from 'lodash';
import UTF8 from 'crypto-js/enc-utf8';

const Chat = ({ msgs, setMsgs, name }) => {
  const ref = useRef(null);
  const sendMsg = (event) => {
    event.preventDefault();
    const msg = {};

    // Gera salt aleatório para o Aes e uma chave usando a senha Admin
    var saltAes = CryptoJS.lib.WordArray.random(128 / 8); 
    var keyAes = Pbkdf2("qwey123", saltAes, { 
      keySize: 128 / 32,
      iterations: 1000
    });

    // Gera salt aleatório para o HMac e uma chave usando a senha Admin
    var saltHMac = CryptoJS.lib.WordArray.random(128 / 8) 
    var keyHMac = Pbkdf2("qwey123", saltHMac, { 
      keySize: 128 / 32,
      iterations: 1000
    });

    // Gera salt aleatório para o IV e uma chave usando a senha Admin
    var saltIv = CryptoJS.lib.WordArray.random(128 / 8); 
    var iv = Pbkdf2("qwey123", saltIv, { 
      keySize: 128 / 32,
      iterations: 1000
    });


    msg.encrypted = encrypt(name+event.target[0].value, keyAes, iv);
    msg.macMsg = SHA256(msg.encrypted.toString(), keyHMac);
    msg.saltAes = saltAes;
    msg.saltHMac = saltHMac;
    msg.saltIv = saltIv

// Envia a mensagem criptografada juntamente com os 3 Salts gerados e o HMAC da mensagem
    setMsgs([...msgs, msg]); 
    ref.current.value = '';
  }

  const encrypt = (msg, key, iv) => {
    // Criptografa a mensagem usando AES com a chave e o IV gerados
    return AES.encrypt(msg, key, {
      mode: CTR,
      iv: iv,
      padding: NoPadding
    });
  };

  const decipher = (msg) => {
    //Decriptografa a mensagem
    //Gera as Keys e IVs usando os salts recebidos + a senha admin
    var keyAes = Pbkdf2("qwey123", msg.saltAes, {
      keySize: 128 / 32,
      iterations: 1000
    });
    var keyHMac = Pbkdf2("qwey123", msg.saltHMac, {
      keySize: 128 / 32,
      iterations: 1000
    });
    var iv = Pbkdf2("qwey123", msg.saltIv, {
      keySize: 128 / 32,
      iterations: 1000
    });

    //Gera um HMac usando a Key gerada
    const newMac = SHA256(msg.encrypted.toString(), keyHMac);

    //Compara o HMac recebido com o HMac gerado
    if(JSON.stringify(newMac.words) !== JSON.stringify(msg.macMsg.words)) return 'Erro na mensagem';

    //Decifra a mensagem usando a Chave Gerada caso o HMAc seja válido
    const decryptedData = AES.decrypt(msg.encrypted, keyAes, {
      mode: CTR,
      iv: iv,
      padding: NoPadding
    });
    return decryptedData.toString(UTF8);
  }

  // const handleChange = _.throttle((s) => { setNewMsg(name+s.target.value) }, 1000)

  return (
      <>
        <div>{`Chat da(o) ${name}`}</div>
        <ul>
            { msgs.length > 0 && (
                msgs.map(msg => (<li key={decipher(msg)+Math.random()}>{decipher(msg)}</li>))
            )}
        </ul>
        <form onSubmit={(event) => sendMsg(event)}>
            <input type="text" ref={ref} required></input>
        </form>
      </>
   );
};

export default Chat;
