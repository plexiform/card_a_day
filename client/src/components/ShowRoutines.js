import React from 'react';
import axios from 'axios';
import { CredentialsContext } from '../context';

class ShowRoutines extends React.Component {
  static contextType = CredentialsContext;
  constructor(props) {
    super();
    this.state = {
      routines: []
    }
  }

  componentDidMount() {

    axios.get('/api/routines', {
      headers: {
        'Authorization': `Basic ${this.context[0].username}:${this.context[0].password}`
      },
      withCredentials: true
    })
      .then(res => {
        this.setState({
          routines: res.data
        })
      })
      .catch(err => console.log('couldnt retrieve routines'))
  }


  render() {
    console.log('test routine render');
    const routines = this.state.routines;
    let routineList = routines.map((routine, key) =>
      <div key={routine.id}>
        <br />
        <br />
        Grateful for: {routine.routineItems.gratitude}
        <br />
        Values to embody: {routine.routineItems.values}
        <br />
        Why those values matter: {routine.routineItems.value_affirmation}
        <br />
        Type of meditation: {routine.routineItems.type_of_meditation}
        <br />
        Minutes spent: {routine.routineItems.minutes_spent}
        <br />
        Date: {routine.routineItems.date}
      </div>
    );

    return (
      <div>
        <span style={{ float: 'right', marginRight: `10%` }}>!!!user</span>
        {routineList}
      </div>
    )
  }
}

export default ShowRoutines;