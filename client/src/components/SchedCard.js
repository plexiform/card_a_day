import React from 'react'
import axios from 'axios'
import styled from 'styled-components'

class SchedCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userId,
      id: props.id,
      sched: props.sched,
      percent: props.percentPomos,
      finished: props.finished
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
  }

  handleFinish = e => {
    e.preventDefault();
    this.setState({
      finished: true
    }, () => { this.handleSubmit(e) });
  };

  handleSubmit = e => {
    e.preventDefault();

    const data = {
      userId: this.state.userId,
      id: this.state.id,
      sched: this.state.sched,
      percent: this.state.percent,
      finished: this.state.finished
    };

    console.log('datafin', this.state.finished)

    axios
      .put(`/api/schedules/${data.id}`, data)
      .then(res => {
        console.log('put state', this.state)
      })
      .catch(err => console.log('err'));

    this.setState({
      percent: (this.state.sched.numPomos / this.state.sched.maxPomos) * 100
    })

    this.props.setTrigger(prevState => !prevState);
  }

  handleCounter(bool) {
    let schedule = this.state.sched;

    if (bool === true && schedule.numPomos < schedule.maxPomos) {
      schedule.numPomos = schedule.numPomos + 1;
    } else if (bool === false && schedule.numPomos > 0) {
      schedule.numPomos = schedule.numPomos - 1;
    }

    this.setState({
      sched: schedule
    });
  }

  render() {
    const currentCard = this.state.sched;

    const StyleSched = styled.div`
      ${currentPercent => (this.state.percent >= 0 && this.state.percent < 33.34) &&
        `color:red`
      }
      ${currentPercent => (this.state.percent > 33.34 && this.state.percent < 66.67) &&
        `color:#4EDABE`
      }
      ${currentPercent => (this.state.percent > 66.67 && this.state.percent <= 100) &&
        `color:limegreen`
      }
    `

    return (
      <StyleSched>
        {currentCard.numPomos} <span></span>
        {(new Date() > new Date(currentCard.endTime)) || this.state.finished ? '' :
          <span>
            <button onClick={() => this.handleCounter(false)}>-</button>
            <button onClick={() => this.handleCounter(true)}>+</button>
          </span>
        }
        <span> {currentCard.goal}</span>
        <br />
        {this.state.percent}% [({currentCard.pomoLength}m / {currentCard.breakLength}m)]
        {(new Date() > new Date(currentCard.endTime)) || this.state.finished ? '' :
          <div>
            <form style={{ display: 'inline-block' }} onSubmit={this.handleSubmit}>
              <button type='submit' value='update'>update</button>
            </form>
            <form style={{ display: 'inline-block' }} onClick={this.handleFinish}>
              <button type='submit' value='fin' >fin</button>
            </form>
          </div>
        }
      </StyleSched>
    )
  }
}

export default SchedCard;