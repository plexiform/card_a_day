import React from 'react'
import axios from 'axios'

class EditSchedule extends React.Component {
  constructor() {
    super();
    this.state = {

    }
  }

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <input
            type='datetime-local'
            onChange={this.handleStartTime}
            defaultValue={this.startTime}
          />
          <span> to </span>

          <input
            type='datetime-local'
            defaultValue={this.endTime}
            onChange={this.handleEndTime}
          />

          <br />
          <span>pomodoro length: </span>
          <input
            type='number'
            name='pomoLength'
            defaultValue='30'
            onChange={this.handleChange}
          />

          <br />
          <span>break length: </span>
          <input
            type='number'
            name='breakLength'
            defaultValue='10'
            onChange={this.handleChange}
          />

          <br />
          <input type='submit' />
        </form>

      </>
    )
  }
}

export default EditSchedule;