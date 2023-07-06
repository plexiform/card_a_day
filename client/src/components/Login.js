import React, { useContext, useState, setError } from 'react';
import { CredentialsContext } from '../context';
import { useHistory } from 'react-router';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCredentials] = useContext(CredentialsContext);

  axios.get('/api', {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  const history = useHistory();

  const login = (e) => {
    if (username && password) {
      e.preventDefault();
      axios.post('/login',
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
          setCredentials({
            username: res.data.userId
          });

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