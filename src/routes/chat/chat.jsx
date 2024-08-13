import './chat.css';
import { useEffect, useState } from 'react';
import { socket } from './../rooms/rooms';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/messages/${Cookies.get('current_room')}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        });

        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    
    socket.on('messages', (data) => {
      console.log(data);
      
      setMessages(data.messages);
    });

    
    return () => {
      socket.off('messages');
    };
  }, []); 

  const handleSubmitSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      
      const newMessages = [...messages, message];
      setMessages(newMessages);

      
      socket.emit('messages', {
        roomId: Cookies.get('current_room'),
        messages: newMessages,
      });

      
      setMessage('');
    }
  };

  return (
    <div id="chatRoom">
      <div id="messages">
        {messages.map((msg, index) => (
          <h1 key={index}>{msg}</h1>
        ))}
      </div>
      <form onSubmit={handleSubmitSend}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
