import React from 'react'
import axios from 'axios';
import ShowSchedule from './TodaySchedule';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import PrimaryDiv from './styles/PrimaryDiv';

class CreateSchedule extends React.Component {
  constructor() {
    super();
    this.state = {
      startTime: '',
      endTime: '',
      pomoLength: 30,
      breakLength: 5,
      numPomos: 0,
      maxPomos: '',
      remainder: '',
      getGoals: [],
      goal: '',
      confirmed: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getMaxPomos = this.getMaxPomos.bind(this);
    this.setMaxPomos = this.setMaxPomos.bind(this);
  }

  componentDidMount() {
    axios.get('/api/goals',
      {
        withCredentials: true
      })
      .then(res => {
        this.setState({
          getGoals: res.data
        })
      })
      .catch(err => console.log(err));

  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      this.setMaxPomos();
    })
  }

  handleStartTime = e => {
    this.setState(
      {
        startTime: e.target.value,
      }, () => {
        this.setMaxPomos();
      });

  }

  handleEndTime = e => {
    this.setState(
      {
        endTime: e.target.value,
        //        confirmed: false
      }, () => {
        this.setMaxPomos();
      });
  }

  handleSelect = e => {
    this.setState({ goal: e.target.value });
  }

  getMaxPomos = (totalMinutes, pomoLength, breakLength) => {

    let timePassed = 0;
    let pomoCount = 0;

    if (breakLength > totalMinutes || pomoLength > totalMinutes) {
      return [0, 0];
    } else {
      while (timePassed < totalMinutes && (totalMinutes - timePassed >= Number(pomoLength)) && Number(pomoLength > 0)) {
        timePassed += Number(pomoLength);
        pomoCount += 1;
        if ((timePassed + Number(breakLength)) < totalMinutes) {
          timePassed += Number(breakLength);
        }
      }

      // !!! some cases where time remaining is off
      // (e.g. 2:30 duration block will show inaccurate time)
      const remainder = totalMinutes - timePassed
      return [pomoCount, remainder];
    }
  }

  setMaxPomos = () => {
    if (this.state.startTime && this.state.endTime) {
      function convertMilliToMinutes(ms) {
        return (ms / 1000) / 60;
      }

      const millisecondsBetween = Date.parse(this.state.endTime) - Date.parse(this.state.startTime);
      const minutesBetween = convertMilliToMinutes(millisecondsBetween);

      const pomosAndRemainder = this.getMaxPomos(minutesBetween, this.state.pomoLength, this.state.breakLength);
      const maxPomos = pomosAndRemainder[0];
      const remainder = pomosAndRemainder[1];

      this.setState({
        maxPomos: maxPomos,
        remainder: remainder
      })

    }
  }

  handleSubmit = e => {
    e.preventDefault();

    // !!! bring in setMaxPomos() here
    function convertMilliToMinutes(ms) {
      return (ms / 1000) / 60;
    }

    const millisecondsBetween = Date.parse(this.state.endTime) - Date.parse(this.state.startTime);
    const minutesBetween = convertMilliToMinutes(millisecondsBetween);

    const maxPomos = this.getMaxPomos(minutesBetween, this.state.pomoLength, this.state.breakLength)[0];

    const data = {
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      pomoLength: this.state.pomoLength,
      breakLength: this.state.breakLength,
      numPomos: 0,
      maxPomos: maxPomos,
      goal: this.state.goal
    }

    axios
      .post('/api/schedules', data, {
        withCredentials: true
      })
      .then(res => {
        // res.data._id
        axios.put(`/api/goals/`, { goal: data.goal, schedId: res.data._id })
          .catch(err => console.log(err));
      })
      .then(res => {
        this.setState({
          startTime: '',
          endTime: '',
          pomoLength: 30,
          breakLength: 5,
          numPomos: 0,
          maxPomos: '',
          getGoals: [],
          goal: ''
        });
        this.props.history.push('/day-cards')
      })
      .catch(err => console.log("couldnt make sched"));

    // !!!
    /*
    axios.put('http://localhost:8082/', {},
      {
        withCredentials: true
      })
      .then(res => {
  
      })
      .catch(err => console.log(err));
    */
  }

  render() {

    return (
      <PrimaryDiv angle={.6} fadeTo='#fb3570'>
        <form
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gridTemplateRows: '1fr 1fr 1fr' }}
          onSubmit={this.handleSubmit}
        >
          <div style={{ gridRow: 1 }}>
            <label for="goals">Select goal:</label>
            <select placeholder="noogie" onChange={this.handleSelect} name="goals">
              <option value="none" selected disabled hidden>Goal</option>
              {this.state.getGoals ?
                this.state.getGoals.map((goal, id) => {
                  return (
                    <option key={id}>{goal.goalName}</option>
                  )
                })
                :
                <option>no goals</option>
              }
            </select>
          </div>

          <div style={{ display: 'grid', gridRow: 2 }}>
            <div>
              <div>Start time:</div>
              <input
                className="date-entry"
                style={{ width: '100%' }}
                type='datetime-local'
                onChange={this.handleStartTime}
              />
            </div>

            <div style={{ gridColumn: 2 }}>
              <div>End time:</div>
              <input
                className="date-entry"
                style={{ width: '100%' }}
                type='datetime-local'
                onChange={this.handleEndTime}
              //defaultValue={}
              //value={}
              />
            </div>
          </div>

          <div style={{ gridColumnStart: 1 }}>
            <div>pomodoro length: </div>
            <input
              style={{ width: '100%' }}
              type='number'
              name='pomoLength'
              defaultValue='30'
              onChange={this.handleChange}
            />
          </div>

          <div>
            <div>break length: </div>
            <input
              style={{ width: '100%' }}
              type='number'
              name='breakLength'
              defaultValue='5'
              onChange={this.handleChange}
            />
          </div>

          {this.state.maxPomos &&
            <div style={{ gridColumnStart: 1 }}>room for {this.state.maxPomos} pomos max,
              w/ {this.state.remainder} minutes to spare</div>

          }

          <button
            type='submit'
            style={{ gridColumnStart: 1, gridColumnEnd: 3 }}
          >
            submit
          </button>

        </form >


        <hr />
      </PrimaryDiv>
    )
  }
}

export default withRouter(CreateSchedule);