import './chat.css';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages , setMessages] = useState([]);
  // useEffect(()=>{
    





  // },[]);



  const handleSubmitSend = (e) => {
    e.preventDefault();
    



    console.log(message); 
    setMessage(''); 
  };

  return (
    <div id="chatRoom">
        <div id='messages'>

        </div>
      <form onSubmit={handleSubmitSend}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}
