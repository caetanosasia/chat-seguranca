import React, {useState} from 'react';
import Chat from '../Chat';

const Container = () => {
  //Armazena as mensagens criptografadas recebebidas pelos chats e distribui as mesmas para os chats
  const [msgs, setMsgs] = useState([]);  

  return (
      <>
      <div>
        <Chat msgs={msgs} setMsgs={setMsgs} name="Bob: " />
      </div>
      <div>
        <Chat msgs={msgs} setMsgs={setMsgs} name="Alice: " />
      </div>
      </>
   );
};

export default Container;
