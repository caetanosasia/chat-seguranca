import React, {useState} from 'react';
import Chat from '../Chat';

const Container = () => {
  const [msgs, setMsgs] = useState([]);  

  return (
      <>
        <Chat msgs={msgs} setMsgs={setMsgs} name="Bob: " />
        <Chat msgs={msgs} setMsgs={setMsgs} name="Alice: " />
      </>
   );
};

export default Container;
