import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import { Route } from 'react-router';
import PrivateRoute from './PrivateRoute';
import ShowRoutines from './ShowRoutines';
import PublicProfile from './PublicProfile';
import axios from 'axios';

export default function Welcome() {
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setIsLoading(false);
      })
      .catch(err => console.log(err))
  }, []);

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
      <div style={{ gridColumnStart: 2 }}>
        {!isLoading ? <PublicProfile username={user} /> : 'Loading'}
      </div>
    </div>
  )
}