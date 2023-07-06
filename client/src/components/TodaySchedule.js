import React from 'react';
import axios from 'axios';
import SchedCard from './SchedCard';
import { CredentialsContext } from '../context';

class ShowSchedule extends React.Component {
  static contextType = CredentialsContext;
  constructor() {
    super();
    this.state = {
      schedules: [],
    }
  }

  componentDidMount() {

    axios.get('/api/schedules',
      {
        headers: {
          'Authorization': `Basic ${this.context[0].username}:${this.context[0].password}`
        },
        withCredentials: true
      })
      .then(res => {
        this.setState({
          schedules: res.data,
        })
      })
      .catch(err => console.log('no scheds retrieved'))
  }

  render() {
    console.log('state:', this.state)

    let schedules = this.state.schedules;
    let scheduleList = schedules.map((routine, id) => {
      function splitDate(date) {
        let splitT = date.split("T");
        let day = splitT[0];
        let longTime = splitT[1];
        let shortTime = longTime.substr(0, 5);
        return [day, shortTime];
      }

      const dayAndTime = splitDate(routine.timeBlock.startTime);
      const day = dayAndTime[0];
      const startTime = splitDate(routine.timeBlock.startTime)[1];
      const endTime = splitDate(routine.timeBlock.endTime)[1];

      return (
        <div key={id}>
          {day}, from {startTime} to {endTime} fits {routine.timeBlock.maxPomos} {routine.timeBlock.pomoLength} minute pomodoros, with {routine.timeBlock.breakLength} minute breaks between each
          <SchedCard sched={routine.timeBlock} />
          <form>

          </form>
        </div >

      )
    }
    )


    return (
      <>
        {scheduleList}
      </>
    )
  }
}

export default ShowSchedule;