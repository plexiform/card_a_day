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
      date: new Date(new Date() - (new Date().getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      postVals: [],
      completed_fast: false,
      meditated: false,
      deadline: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:8082/api/values', {
      withCredentials: true
    }).then(res => {
      this.setState({
        values: res.data
      })
    }).catch(err => {
      console.log(err);
    });

    axios.get('http://localhost:8082/api/deadlines', {
      withCredentials: true
    }).then(res => {
      this.setState({
        deadline: res.data.deadline
      })
    }).catch(err => {
      console.log(err);
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDate = e => {
    this.setState({ date: e.target.value });
  }

  handleToggleChange = e => {
    const stateItem = e.target.dataset.key;
    this.setState(prevState => ({
      [stateItem]: !prevState[stateItem]
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
      .post('http://localhost:8082/api/routines', data,
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
          completed_fast: false,
          meditated: false
        })
      })
      .catch(err => console.log('no create routino'));
  }

  render() {
    return (
      <div style={{ width: '50%' }} className="CreateRoutine ">
        <h3>Show already created routine on this page</h3>
        <div style={{ float: 'right' }}>{this.state.date}</div>
        <div>Deadline: {this.state.deadline}
        </div>
        {new Date(new Date() - (new Date().getTimezoneOffset() * 60000)).toISOString()
          < `${new Date(new Date() - (new Date().getTimezoneOffset() * 60000)).toISOString().split("T")[0].substr(0, 10)}T${this.state.deadline}:00` ?
          <div>
            Start your day right.
            <form noValidate onSubmit={this.handleSubmit}>
              <div>
                <input
                  style={{ width: '100%' }}
                  autoComplete="off"
                  type='text'
                  placeholder='things youre grateful for'
                  name='gratitude'
                  value={this.state.gratitude}
                  onChange={this.handleChange}
                />
              </div>

              <div
              >
                <span>Values to embody: </span>
                {
                  this.state.values.map((val, id) => {
                    const value = val.valueAndReason.value;
                    return (
                      <div
                        style={{ display: 'inline-block' }}>
                        <input
                          type='checkbox'
                          className='valueButton'
                          placeholder='values you want to embody'
                          name='postVals'
                          value={value}
                          id={id}
                          onChange={this.handleCheckboxChange}
                        />
                        <label id='valueLabel' for={id}>{value}</label>
                      </div>
                    )
                  })
                }
              </div>

              {/* !!!*/}

              <div>
                <textarea
                  style={{ width: '100%', height: '100px', border: '1 solid white' }}
                  autocomplete="off"
                  placeholder='why are you focusing on these values today?'
                  name='value_affirmation'
                  value={this.state.value_affirmation}
                  onChange={this.handleChange}
                />
              </div>

              <div>
                <input
                  type='radio'
                  id='meditated'
                  data-key='meditated'
                  checked={this.state.meditated}
                  onClick={this.handleToggleChange}
                >
                </input>
                <label for='meditated'>Did you meditate?</label>
              </div>

              {this.state.meditated &&
                <div>
                  <div>
                    <input
                      style={{ width: '100%' }}
                      autocomplete="off"
                      type='text'
                      placeholder='what type of meditation did you do?'
                      name='type_of_meditation'
                      value={this.state.type_of_meditation}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div>
                    <input
                      style={{ width: '100%' }}
                      autocomplete="off"
                      type='number'
                      placeholder='how long did you meditate for?'
                      name='minutes_spent'
                      value={this.state.minutes_spent}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              }

              <div>
                <input
                  type='radio'
                  id='completed_fast'
                  placeholder='did you complete your fast?'
                  name='completed_fast'
                  checked={this.state.completed_fast}
                  value={this.state.completed_fast}
                  defaultValue={false}
                  data-key='completed_fast'
                  onClick={this.handleToggleChange}
                  readOnly
                />
                <label for='completed_fast'>Did you complete your fast?</label>
                <span>[x]exercise?</span>
              </div>

              <button
                type="submit"
              >
                submit
              </button>
            </form>
          </div >
          :
          <></>
        }
      </div>
    )
  }
}

export default CreateRoutine;