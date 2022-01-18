import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import { Route } from 'react-router';
import PrivateRoute from './PrivateRoute';
import ShowRoutines from './ShowRoutines';

export default function Welcome() {

  return (
    <div style={{ display: 'grid', paddingTop: '2em' }}>
      <div
        style={{
          gridColumnStart: 1,
          fontFamily: 'open-sans-condensed',
          fontSize: '2em',
          width: '500px',
          paddingLeft: '1em'
        }}>
        Keep yourself accountable with this science-based toolkit for increased well-being. Easy identification of streaks to build good habits.
        <br /><br />
        exercising gratitude, setting goals, meditating mindfully or lovingly, journaling, noting three good things at the end of the day, affirming your values
        <br /><br />
        The only requirement is honesty.
      </div>
      <div style={{ gridColumnStart: 2, width: '400px', height: '500px', border: '1px white solid' }}>

      </div>
    </div>
  )
}