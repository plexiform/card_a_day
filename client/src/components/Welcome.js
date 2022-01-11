import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import { Route } from 'react-router';
import PrivateRoute from './PrivateRoute';
import ShowRoutines from './ShowRoutines';

export default function Welcome() {

  return (
    <div>
      <Link to="/create-routine">Track your morning routine</Link>
      <br />
      <Link to="/create-schedule">Block your time</Link>
      <br />
      <Link to="/day-cards">See your Daily cards</Link>
    </div>
  )
}