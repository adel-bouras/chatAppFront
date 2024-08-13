import { useNavigate } from 'react-router-dom';
import './rooms.css';
import { useEffect, useState } from 'react';
import ErrorPage from './../../routes/errorPage/errorPage';
import Cookies from 'js-cookie';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://chatappbackend-rkvj.onrender.com');

function Room() {
    const [render, setRender] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(true);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`https://chatappbackend-rkvj.onrender.com/api/users/messages/${Cookies.get('current_room')}`, {
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

        const bringRooms = async () => {
            try {
                const response = await axios.get('https://chatappbackend-rkvj.onrender.com/api/users/rooms', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });
                setRooms(response.data);
                setError(false);
            } catch (e) {
                setError(e.response?.data?.message || 'An error occurred');
            }
        };
        bringRooms();

        socket.on('create', (data) => {
            Cookies.set('current_room', data.roomId);
            setRender(prevRender => !prevRender);
        });

        socket.on('onTyping', (data) => {
            console.log(data);
            document.getElementById('typing').innerHTML = data;
            document.getElementById('typing').style.display = 'block';
        });

        socket.on('noTyping', (data) => {
            document.getElementById('typing').style.display = 'none';
        });


    }, [messages]);

    const handleRoomClicked = (index) => {
        socket.emit('join', { userId: Cookies.get('_id'), roomId: rooms[index]._id });
        Cookies.set('current_room', rooms[index]._id);
        setRender(!render);
    };

    const handleCreateRoom = () => {
        socket.emit('create', { userId: Cookies.get('_id') });
    };

    const handleLogout = () => {
        localStorage.clear();
        const allCookies = Cookies.get();
        for (const cookieName in allCookies) {
            Cookies.remove(cookieName);
        }
        navigate('/');
    };

    const handleSubmitSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('message', {
                roomId: Cookies.get('current_room'),
                message: message,
            });
            setMessage('');
        }
    };








    const handleTyping = () => {
            socket.emit('onTyping' , {roomId : Cookies.get('current_room') , fullName : Cookies.get('fullName')});
    };

    const handleStopTyping = () => {
            setTimeout(() => {
            socket.emit('noTyping' , {roomId : Cookies.get('current_room') , fullName : Cookies.get('fullName')});
            }, 5000);
    };








    return (
        error ? (
            <ErrorPage />
        ) : (
            <div id="roomsPage">
                <div id="rooms">
                    <div id="buttons">
                        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Logout</button>
                        <button onClick={handleCreateRoom}>Create</button>
                    </div>
                    <h1>Rooms:</h1>
                    {rooms.map((element, index) => (
                        <div onClick={() => handleRoomClicked(index)} key={index} className="room">
                            <h3>{element._id}</h3>
                        </div>
                    ))}
                </div>
                <div id="chat">
                    <div id="chatRoom">
                        <div id="messages">
                            {messages.map((msg, index) => (
                                <h1 key={index}>{msg}</h1>
                            ))}
                        </div>
                        <form onSubmit={handleSubmitSend}>
                             <p style = {{display : 'none'}}id='typing'>User typing...</p>
                            <input
                                id='typing_input'
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleTyping}
                                onKeyUp={handleStopTyping}
                                placeholder="Type your message here..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}

export default Room;
