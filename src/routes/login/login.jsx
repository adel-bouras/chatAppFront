import { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loged, setLoged] = useState(false);
  const [error, setError] = useState(false);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState(false);

  const navigat = useNavigate('');


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('https://chatappbackend-rkvj.onrender.com/api/users/login',{
        email : email ,
        password : password
      })
      console.log(response);
      setError(false);
      Cookies.set('email' , response.data.email , {expires : 1});
      Cookies.set('fullName' , response.data.fullName , {expires : 1});
      Cookies.set('token' , response.data.token , {expires : 1});
      Cookies.set('_id' , response.data._id , {expires : 1});
      localStorage.setItem('rooms' , JSON.stringify(response.data.rooms));
      setLoged(true);
    }catch(e){
      setError(e.response.data.message);
      console.log(e);
      setLoged(false);
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('https://chatappbackend-rkvj.onrender.com/api/users/register' , {
        fullName : fullName,
        email : registerEmail ,
        password : registerPassword
      })
      setRegisterError(false);
      console.log(response);
      Cookies.set('email' , response.data.email , {expires : 1});
      Cookies.set('fullName' , response.data.fullName , {expires : 1});
      Cookies.set('token' , response.data.token , {expires : 1});
      Cookies.set('_id' , response.data._id , {expires : 1});
      localStorage.setItem('rooms' , JSON.stringify(response.data.rooms));
      setLoged(true);
    }catch(e){
      setRegisterError(e.response.data.message);
      console.log(registerError);
      setLoged(false);
    }
  };

  if(loged) navigat('/user');
  
  return (
    <div id="mainPage">
      <div id="login">
        <h1>Login</h1>
        <h2 style={{color : 'red'}}>{error}</h2>
        <form onSubmit={handleLoginSubmit}>
          <input
            placeholder='Enter your email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            placeholder='Enter your Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <button type="submit">LOGIN</button>
        </form>
      </div>

      <div id="register">
        <h1>Register</h1>
        <h2 style={{color : 'red'}}>{registerError}</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input
            placeholder='Enter your full name'
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
          />
          <input
            placeholder='Enter your email'
            required
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            type="email"
          />
          <input
            placeholder='Enter your password'
            required
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            type="password"
          />
          <button type="submit">REGISTER</button>
        </form>
      </div>
    </div>
  );
}