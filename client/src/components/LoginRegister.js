import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

export default function LoginRegister() {

  return (
    <div>
      <h1>Log in</h1>
      <Login />
      <h1>Register</h1>
      <Register />
    </div>
  )
}