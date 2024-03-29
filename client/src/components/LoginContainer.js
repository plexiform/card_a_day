import react, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios'
import Login from './Login';

export default function LoginContainer(props) {
  const [isLoggedIn, setLog] = useState(false);
  const [isLoading, setLoad] = useState(true);

  useEffect(() => {
    axios.get('/api',
      {
        withCredentials: true
      }).then((res) => {
        if (typeof res.data == 'string') {
          setLog(true);
          setLoad(false);
        }
      })
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <Redirect to='/welcome' />
    )
  } else {
    return (
      <Login />
    )
  }
}