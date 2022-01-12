import React from 'react';
import axios from 'axios';
import { CredentialsContext } from '../context';

class CreateRoutine extends React.Component {
  static contextType = CredentialsContext;
  constructor() {
    super();
    this.state = {
      gratitude: '',
      values: [],
      value_affirmation: '',
      type_of_meditation: '',
      minutes_spent: '',
      date: '',
      postVals: [],
      completed_fast: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  componentDidMount() {
    axios.get('/api/values', {
      withCredentials: true
    }).then(res => {
      this.setState({
        values: res.data
      })
    }).catch(err => {
      console.log(err);
    })
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDate = e => {
    this.setState({ date: e.target.value });
  }

  handleToggleChange = e => {
    this.setState(prevState => ({
      completed_fast: !prevState.completed_fast
    }))
  }

  handleCheckboxChange = e => {
    if (e.target.checked) {
      this.setState(prevState => ({
        [e.target.name]: [...prevState[e.target.name], e.target.value]
      }))
    } else {
      const filteredList = this.state[e.target.name].filter(checkedBox => {
        return checkedBox !== e.target.value
      });

      this.setState(prevState => ({
        [e.target.name]: [...filteredList]
      }));
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const data = {
      gratitude: this.state.gratitude,
      values: this.state.postVals,
      value_affirmation: this.state.value_affirmation,
      type_of_meditation: this.state.type_of_meditation,
      minutes_spent: this.state.minutes_spent,
      date: this.state.date,
      completed_fast: this.state.completed_fast
    };

    //console.log(this.context[0].username);
    axios
      .post('/api/routines', data,
        {
          headers: {
            'Authorization': `Basic ${this.context[0].username}:${this.context[0].password}`
          },
          withCredentials: true
        })
      .then(res => {
        this.setState({
          gratitude: '',
          values: [],
          value_affirmation: '',
          type_of_meditation: '',
          minutes_spent: '',
          date: '',
          postVals: [],
          completed_fast: false
        })
      })
      .catch(err => console.log('no create routino'));
  }

  render() {
    return (
      <div className="CreateRoutine ">
        <div>
          Start your day right.
          <form noValidate onSubmit={this.handleSubmit}>
            <div>
              <input style={{ width: '50%' }}
                autocomplete="off"
                type='text'
                placeholder='things youre grateful for'
                name='gratitude'
                value={this.state.gratitude}
                onChange={this.handleChange}
              />
            </div>

            <span>Values to embody:</span>
            {
              this.state.values.map((val, id) => {
                const value = val.valueAndReason.value;
                return (
                  <div key={id} style={{ display: 'inline-block', margin: '.25em' }}>
                    <input
                      type='checkbox'
                      placeholder='values you want to embody'
                      name='postVals'
                      value={value}
                      key={id}
                      onChange={this.handleCheckboxChange}
                    />
                    <label for={id}>{value}</label>
                  </div>
                )
              })
            }

            {/* !!!*/}

            <div>
              <input
                style={{ width: '50%', height: '100px' }}
                autocomplete="off"
                type='text'
                placeholder='why are you focusing on these values today?'
                name='value_affirmation'
                value={this.state.value_affirmation}
                onChange={this.handleChange}
              />
            </div>

            <div>
              <input
                style={{ width: '50%' }}
                autocomplete="off"
                type='text'
                placeholder='what type of meditation did you do?'
                name='type_of_meditation'
                value={this.state.type_of_meditation}
                onChange={this.handleChange}
              />
            </div>

            <div style={{ width: '50%' }}>
              <input
                type='radio'
                id='completed_fast'
                placeholder='did you complete your fast?'
                name='completed_fast'
                checked={this.state.completed_fast}
                value={this.state.completed_fast}
                defaultValue={false}
                onClick={this.handleToggleChange}
                readOnly
              />
              <label for='completed_fast'>Did you complete your fast?</label>
              <span>  [ x ] exercise?</span>
            </div>


            <div>
              <input
                style={{ width: '50%' }}
                autocomplete="off"
                type='number'
                placeholder='how long did you meditate for?'
                name='minutes_spent'
                value={this.state.minutes_spent}
                onChange={this.handleChange}
              />
            </div>

            <div>
              <input
                className="datePicker"
                type='date'
                name=''
                value={this.state.date}
                onChange={this.handleDate}
              />
            </div>

            <input
              type="submit"
            />
          </form>
        </div>
      </div >
    )
  }
}

export default CreateRoutine;