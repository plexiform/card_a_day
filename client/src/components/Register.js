import React, { useContext, useState, setError } from 'react';
import { CredentialsContext } from '../context';
import { useHistory } from 'react-router';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCredentials] = useContext(CredentialsContext);

  const history = useHistory();

  const register = (e) => {
    e.preventDefault();
    fetch('http://localhost:8082/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(() => {
        setCredentials({
          username,
          password
        })
        history.push('/create-routine')
      })
      .catch((error) => {
        setError(error.message)
      })
  }


  return (
    <div>
      <form onSubmit={register}>
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