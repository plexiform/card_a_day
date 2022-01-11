import React, { useContext, useState, setError } from 'react';
import { CredentialsContext } from '../context';
import { useHistory } from 'react-router';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCredentials] = useContext(CredentialsContext);

  axios.get('/', {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  const history = useHistory();

  const login = (e) => {
    if (username && password) {
      e.preventDefault();
      axios.post('http://localhost:8082/login',
        {
          username,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log('res:', res);
          setCredentials({
            username: res.data.userId
          });

          console.log(CredentialsContext);
          history.push('/welcome');
        })
    }
  }


  return (
    <div>
      <form onSubmit={login}>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        >
        </input>
        <br />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        >
        </input>
        <br />
        <input type="submit"></input>
      </form>
    </div>
  )
}