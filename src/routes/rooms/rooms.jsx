import { Outlet, useNavigate } from 'react-router-dom';
import './rooms.css';
import { useEffect, useState } from 'react';
import ErrorPage from './../../routes/errorPage/errorPage';
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';



function Room(){
    
    const [rooms , setRooms] = useState([]);
    const [error , setError] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        
        const bringRooms = async ()=>{
            try{
                const response = await axios.get('http://localhost:8000/api/users/rooms' , {
                    headers :{
                        Authorization :`Bearer ${Cookies.get('token')}`
                    }
                })
                setRooms(response.data.data);
                setError(false);
            }catch(e){
                setError(e.response.data.message)
            }

        }
bringRooms();
return
    },[])






    const handlRoomClicked = (index)=>{

    }

    const handlCreateRoom = ()=>{


    }

    const handlLogout = ()=>{
        localStorage.clear();
        const allCookies = Cookies.get();

        for (const cookieName in allCookies) {
          if (allCookies.hasOwnProperty(cookieName)) {
            Cookies.remove(cookieName);
          }
        }
        navigate('/');
    }



    return (
            (error) ? (
                <ErrorPage />
            ) : (
                <div id="roomsPage">
                    <div id="rooms">
                        <div id="buttons">
                        <button onClick={handlLogout} style={{backgroundColor :'red', color : 'white'}}>logout</button>
                        <button onClick={handlCreateRoom} >create</button>
                        </div>
                        <h1>Rooms :</h1>
                        {
                            rooms.map((element , index)=> <div onClick={()=>handlRoomClicked(index)} key={index} className="room">
                                <h3>{element}</h3>
        
                            </div>  )
                        }
        
        
                    </div>
                    <div id="chat">
                        <Outlet />            
                    </div>
        
                </div>
            )
    )
}

export default Room;