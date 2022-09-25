import React, { useContext, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import ShowRoutines from './components/ShowRoutines';
import CreateRoutine from './components/CreateRoutine';
import CreateSchedule from './components/CreateSchedule';
import Login from './components/Login';
import Register from './components/Register';
import LoginRegister from './components/LoginRegister';
import { CredentialsContext } from './context';
import axios from 'axios';
import Welcome from './components/Welcome';
import Logout from './components/logout';
import PrivateRoute from './components/PrivateRoute';
import LoginContainer from './components/LoginContainer';
import DayCardes from './components/DayCardes';
import Dashboard from './components/Dashboard';
import EndDay from './components/EndDay';
import PublicProfile from './components/PublicProfile';
import Analytics from './components/Analytics';

function App() {
  const credentialsState = useState({});
  const [isLoggedIn, setLogged] = useState(false);

  useEffect(() => {

    axios.get('http://localhost:8082/api', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).then(res => {
      if (typeof res.data == 'string') {
        setLogged(true);
      }
    })


  })
  return (
    <div>
      <CredentialsContext.Provider value={credentialsState}>

        <Router>
          <Switch>
            <Route exact path='/'  >
              {isLoggedIn ? <Redirect to="/welcome" /> : <LoginRegister />}
            </Route>

            <Route exact path='/login'>
              <LoginContainer component={Login}></LoginContainer>
            </Route>

            <Route exact path='/logout' component={Logout}>
            </Route>

            <Route exact path='/show-routines'>
              <PrivateRoute component={ShowRoutines}>
              </PrivateRoute>
            </Route>

            <Route exact path='/welcome'>
              <PrivateRoute component={Welcome}>
              </PrivateRoute>
            </Route>

            <Route exact path='/create-routine'>
              <PrivateRoute component={CreateRoutine}>
              </PrivateRoute>
            </Route>

            <Route exact path='/create-schedule'>
              <PrivateRoute component={CreateSchedule}>
              </PrivateRoute>
            </Route>

            <Route exact path='/day-cards'>
              <PrivateRoute component={DayCardes}>
              </PrivateRoute>
            </Route>

            <Route exact path='/end-day'>
              <PrivateRoute component={EndDay}>
              </PrivateRoute>
            </Route>

            <Route exact path='/dashboard'>
              <PrivateRoute component={Dashboard}>
              </PrivateRoute>
            </Route>

            <Route exact path='/register' component={Register} />

            <Route path='/analytics'>
              <PrivateRoute component={Analytics}>
              </PrivateRoute>
            </Route>

            <Route path='/:profile/:date?'>
              <PublicProfile />
            </Route>


          </Switch>
        </Router>

      </CredentialsContext.Provider>
    </div >
  )

}

export default App;
